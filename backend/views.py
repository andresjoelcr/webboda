import json
import re
from functools import wraps

from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Q, Sum
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Confirmacion, Invitado, Mensaje

INVITACION = {
    'nombres': 'Isabella & Gabriel',
    'fecha': '18 de Julio',
    'lugar': 'Jardin de los Rosales',
    'horaCeremonia': '4:00 PM',
    'horaRecepcion': '6:30 PM',
    'limiteRsvp': '30 de Junio',
}


def _texto(datos, clave, largo=200):
    valor = str(datos.get(clave, '') or '').strip()
    return valor[:largo]


def _entero(datos, clave, defecto=1):
    try:
        return max(0, min(20, int(datos.get(clave, defecto))))
    except (TypeError, ValueError):
        return defecto


def invitacion(request):
    return JsonResponse(INVITACION)


def _invitado_publico(invitado):
    """Los datos que ve el invitado al abrir su enlace (sin nada del panel)."""
    return {
        'nombre': invitado.nombre,
        'familia': invitado.familia,
        'correo': invitado.correo,
        'telefono': invitado.telefono,
        'estado': invitado.estado,
        'token': invitado.token,
        'respondido': invitado.respondido.isoformat() if invitado.respondido else '',
        'enlace': f'/?token={invitado.token}',
    }


@require_GET
def invitado(request, token):
    """Identifica al invitado por su enlace y abre su sesion personal."""
    fila = Invitado.objects.filter(token=token).first()
    if fila is None:
        return JsonResponse(
            {'ok': False, 'error': 'Este enlace de invitacion no existe'}, status=404
        )

    if request.session.get('invitado_id') != fila.pk:
        request.session.cycle_key()
        request.session['invitado_id'] = fila.pk

    return JsonResponse({'ok': True, 'invitado': _invitado_publico(fila), 'boda': INVITACION})


@require_GET
def invitado_sesion(request):
    """Devuelve la identidad del invitado ya reconocido en esta sesion."""
    invitado_id = request.session.get('invitado_id')
    fila = Invitado.objects.filter(pk=invitado_id).first() if invitado_id else None
    if fila is None:
        request.session.pop('invitado_id', None)
        return JsonResponse({'ok': True, 'autenticado': False, 'invitado': None})

    return JsonResponse(
        {'ok': True, 'autenticado': True, 'invitado': _invitado_publico(fila), 'boda': INVITACION}
    )


# El formulario viaja como JSON desde el navegador (sin cookie de sesion),
# por eso estas vistas publicas no usan la proteccion CSRF de Django.
@require_POST
@csrf_exempt
def rsvp(request):
    """Guarda la confirmacion de asistencia enviada desde el formulario.

    Si el formulario viaja con el token de un invitado del panel, la respuesta
    queda enlazada a esa fila: se actualiza su estado y se completan los datos
    de contacto que faltaban.
    """
    try:
        datos = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Datos invalidos'}, status=400)

    token = _texto(datos, 'token', 32)
    invitado = Invitado.objects.filter(token=token).first() if token else None
    if invitado is None:
        invitado_id = request.session.get('invitado_id')
        invitado = Invitado.objects.filter(pk=invitado_id).first() if invitado_id else None

    nombre = _texto(datos, 'nombre_completo') or _texto(datos, 'nombre', 140)
    if invitado is not None:
        nombre = invitado.nombre
    if not nombre:
        return JsonResponse(
            {'ok': False, 'error': 'El nombre completo es obligatorio'}, status=400
        )

    asistentes = _entero(
        datos, 'asistentes_confirmados', _entero(datos, 'pases', 1)
    )
    asistencia = 'no' if datos.get('asistencia') == 'no' or asistentes == 0 else 'si'

    correo = _texto(datos, 'email', 140) or _texto(datos, 'correo', 140)
    telefono = _texto(datos, 'telefono', 40)
    nombre_familia = _texto(datos, 'nombre_familia', 120)

    confirmacion = Confirmacion.objects.create(
        nombre=nombre,
        cedula=_texto(datos, 'cedula', 20),
        nombre_familia=nombre_familia or (invitado.familia if invitado else ''),
        correo=correo,
        telefono=telefono,
        pases=asistentes,
        acompanantes=_texto(datos, 'acompanantes', 300),
        asistencia=asistencia,
        menu=_texto(datos, 'menu', 60),
        alergias=_texto(datos, 'alergias_restricciones', 400)
        or _texto(datos, 'alergias', 400),
        cancion=_texto(datos, 'cancion', 200),
        mensaje=_texto(datos, 'mensaje', 1200),
    )

    if invitado is not None:
        request.session['invitado_id'] = invitado.pk
        invitado.estado = asistencia
        invitado.respondido = timezone.now()
        if correo:
            invitado.correo = correo
        if telefono:
            invitado.telefono = telefono
        invitado.save(
            update_fields=['estado', 'respondido', 'correo', 'telefono']
        )

    return JsonResponse(
        {
            'ok': True,
            'id': confirmacion.pk,
            'asistencia': asistencia,
            'mensaje': (
                '¡Gracias! Tu confirmacion quedo registrada.'
                if asistencia == 'si'
                else 'Lamentamos que no puedas acompañarnos. Lo registramos igual.'
            ),
        },
        status=201,
    )


@require_POST
@csrf_exempt
def rsvp_cancelar(request):
    """Cancela la respuesta RSVP del invitado identificado por enlace/sesion."""
    try:
        datos = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Datos invalidos'}, status=400)

    token = _texto(datos, 'token', 32) if isinstance(datos, dict) else ''
    invitado = Invitado.objects.filter(token=token).first() if token else None
    if invitado is None:
        invitado_id = request.session.get('invitado_id')
        invitado = Invitado.objects.filter(pk=invitado_id).first() if invitado_id else None
    if invitado is None:
        return JsonResponse(
            {'ok': False, 'error': 'Abre el enlace personal para cancelar tu confirmacion'},
            status=401,
        )

    Confirmacion.objects.filter(
        nombre=invitado.nombre,
        nombre_familia=invitado.familia,
    ).delete()
    invitado.estado = 'pendiente'
    invitado.respondido = None
    invitado.save(update_fields=['estado', 'respondido'])

    return JsonResponse(
        {'ok': True, 'estado': invitado.estado, 'mensaje': 'Cancelamos tu confirmacion. Tu invitacion quedo sin responder.'}
    )


@require_GET
def felicitaciones(request):
    """Ultimos mensajes del libro de visitas (los mas recientes primero)."""
    mensajes = Mensaje.objects.all()[:40]
    return JsonResponse(
        {
            'mensajes': [
                {
                    'autor': m.autor,
                    'mensaje': m.mensaje,
                    'fecha': m.creado.isoformat(),
                }
                for m in mensajes
            ]
        }
    )


@require_POST
@csrf_exempt
def felicitacion(request):
    """Guarda un mensaje del libro de visitas."""
    try:
        datos = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Datos invalidos'}, status=400)

    autor = _texto(datos, 'autor', 120)
    mensaje = _texto(datos, 'mensaje', 600)

    if not autor or not mensaje:
        return JsonResponse(
            {'ok': False, 'error': 'Escribe tu nombre y tu mensaje'}, status=400
        )

    creado = Mensaje.objects.create(autor=autor, mensaje=mensaje)

    return JsonResponse(
        {
            'ok': True,
            'mensaje': {
                'autor': creado.autor,
                'mensaje': creado.mensaje,
                'fecha': creado.creado.isoformat(),
            },
        },
        status=201,
    )


# ------------------------------------------------------------------ panel admin


def _solo_admin(vista):
    """Vista del panel: exige sesion iniciada y responde 401 en JSON."""

    @wraps(vista)
    def envoltura(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse(
                {'ok': False, 'error': 'Necesitas iniciar sesion'}, status=401
            )
        if not (request.user.is_staff):
            return JsonResponse(
                {'ok': False, 'error': 'Tu usuario no es administrador'}, status=403
            )
        return vista(request, *args, **kwargs)

    return envoltura


def _cuerpo(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return {}


@require_POST
def admin_login(request):
    """Inicio de sesion del panel con las credenciales de .env."""
    datos = _cuerpo(request)
    usuario = _texto(datos, 'usuario', 150)
    clave = str(datos.get('clave') or '')

    if not usuario or not clave:
        return JsonResponse(
            {'ok': False, 'error': 'Escribe tu usuario y tu contrasena'}, status=400
        )

    usuario_valido = authenticate(request, username=usuario, password=clave)
    if usuario_valido is None:
        return JsonResponse(
            {'ok': False, 'error': 'Usuario o contrasena incorrectos'}, status=401
        )

    if not usuario_valido.is_staff:
        return JsonResponse(
            {'ok': False, 'error': 'Tu usuario no es administrador'}, status=403
        )

    login(request, usuario_valido)

    return JsonResponse(
        {
            'ok': True,
            'usuario': usuario_valido.get_username(),
            'nombre': usuario_valido.get_full_name() or usuario_valido.get_username(),
        }
    )


@require_POST
@_solo_admin
def admin_logout(request):
    """Cierra la sesion del panel."""
    logout(request)
    return JsonResponse({'ok': True})


@require_GET
def admin_sesion(request):
    """Dice si la sesion actual tiene permisos de administrador."""
    autenticado = request.user.is_authenticated and (
        request.user.is_staff
    )
    return JsonResponse(
        {
            'ok': True,
            'autenticado': autenticado,
            'usuario': request.user.get_username() if autenticado else '',
        }
    )


@require_GET
@_solo_admin
def admin_invitados(request):
    """Lista de invitados del panel con su enlace personal."""
    return JsonResponse(
        {
            'ok': True,
            'invitados': [
                {
                    'id': i.id,
                    'nombre': i.nombre,
                    'familia': i.familia,
                    'correo': i.correo,
                    'telefono': i.telefono,
                    'estado': i.estado,
                    'token': i.token,
                    'enlace': f'/?token={i.token}',
                    'creado': i.creado.isoformat(),
                    'respondido': i.respondido.isoformat() if i.respondido else '',
                }
                for i in Invitado.objects.all()
            ],
        }
    )


@require_POST
@_solo_admin
def admin_invitado_crear(request):
    """Da de alta un invitado y devuelve el enlace para compartirlo."""
    datos = _cuerpo(request)

    if not isinstance(datos, dict):
        return JsonResponse(
            {'ok': False, 'error': 'Los datos del invitado no tienen un formato valido'},
            status=400,
        )

    nombre = _texto(datos, 'nombre', 140)
    familia = _texto(datos, 'familia', 120)

    if len(nombre) < 2:
        return JsonResponse(
            {'ok': False, 'error': 'Escribe los nombres y apellidos'}, status=400
        )
    if not familia:
        return JsonResponse(
            {'ok': False, 'error': 'Escribe la familia del invitado'}, status=400
        )

    correo = _texto(datos, 'correo', 140)
    if correo and not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', correo):
        return JsonResponse(
            {'ok': False, 'error': 'El correo no parece valido. Corrigelo o deja el campo vacio.'},
            status=400,
        )

    fila = Invitado.objects.create(
        nombre=nombre, familia=familia, correo=correo, telefono=_texto(datos, 'telefono', 40)
    )

    return JsonResponse(
        {
            'ok': True,
            'invitado': {
                'id': fila.id,
                'nombre': fila.nombre,
                'familia': fila.familia,
                'correo': fila.correo,
                'telefono': fila.telefono,
                'estado': fila.estado,
                'token': fila.token,
                'enlace': f'/?token={fila.token}',
                'creado': fila.creado.isoformat(),
                'respondido': '',
            },
        },
        status=201,
    )


@require_POST
@_solo_admin
def admin_invitado_borrar(request, pk):
    """Da de baja un invitado del panel."""
    borrados, _ = Invitado.objects.filter(pk=pk).delete()
    if not borrados:
        return JsonResponse(
            {'ok': False, 'error': 'Ese invitado ya no existe'}, status=404
        )

    return JsonResponse({'ok': True})


@require_GET
@_solo_admin
def admin_resumen(request):
    """Cifras y listado completo de invitados, confirmaciones y felicitaciones."""
    confirmaciones = Confirmacion.objects.all()
    invitados = Invitado.objects.all()

    resumen = confirmaciones.aggregate(
        total=Count('id'),
        asistentes=Sum('pases', filter=Q(asistencia='si')),
        no_asisten=Count('id', filter=Q(asistencia='no')),
    )

    familias = {
        confirmacion.nombre_familia.strip()
        for confirmacion in confirmaciones
        if confirmacion.nombre_familia.strip()
    }
    grupos = sorted(familias)

    return JsonResponse(
        {
            'ok': True,
            'resumen': {
                'confirmaciones': resumen['total'] or 0,
                'asistentes': resumen['asistentes'] or 0,
                'no_asisten': resumen['no_asisten'] or 0,
                'grupos': len(grupos),
                'felicitaciones': Mensaje.objects.count(),
                'invitados': invitados.count(),
                'invitados_respondidos': invitados.exclude(estado='pendiente').count(),
            },
            'invitados': [
                {
                    'id': i.id,
                    'nombre': i.nombre,
                    'familia': i.familia,
                    'correo': i.correo,
                    'telefono': i.telefono,
                    'estado': i.estado,
                    'token': i.token,
                    'enlace': f'/?token={i.token}',
                    'creado': i.creado.isoformat(),
                    'respondido': i.respondido.isoformat() if i.respondido else '',
                }
                for i in invitados
            ],
            'confirmaciones': [
                {
                    'id': c.id,
                    'nombre_completo': c.nombre,
                    'cedula': c.cedula,
                    'nombre_familia': c.nombre_familia,
                    'telefono': c.telefono,
                    'email': c.correo,
                    'asistentes_confirmados': c.pases,
                    'asistencia': c.asistencia,
                    'alergias_restricciones': c.alergias,
                    'fecha': c.creada.isoformat(),
                }
                for c in confirmaciones
            ],
            'felicitaciones': [
                {
                    'id': m.id,
                    'autor': m.autor,
                    'mensaje': m.mensaje,
                    'fecha': m.creado.isoformat(),
                }
                for m in Mensaje.objects.all()[:100]
            ],
        }
    )
