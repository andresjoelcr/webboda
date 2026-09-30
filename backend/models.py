import secrets

from django.db import models


def _token():
    """Enlace unico e imposible de adivinar para la invitacion personal."""
    return secrets.token_urlsafe(12)


class Invitado(models.Model):
    """Invitado dado de alta desde el panel.

    Cada fila genera su propio enlace (/invitacion/<token>/): quien lo abre entra
    directo a su RSVP sin usuario y sin contrasena.
    """

    ESTADOS = [
        ('pendiente', 'Sin responder'),
        ('si', 'Confirmado'),
        ('no', 'No asistira'),
    ]

    nombre = models.CharField('Nombres y apellidos', max_length=140)
    familia = models.CharField('Familia', max_length=120)
    correo = models.EmailField('Correo electronico', max_length=140, blank=True)
    telefono = models.CharField('Telefono', max_length=40, blank=True)
    estado = models.CharField('Estado', max_length=10, choices=ESTADOS, default='pendiente')
    token = models.SlugField('Enlace', max_length=32, unique=True, default=_token, editable=False)
    creado = models.DateTimeField('Registrado', auto_now_add=True)
    respondido = models.DateTimeField('Respondio', null=True, blank=True)

    class Meta:
        verbose_name = 'Invitado'
        verbose_name_plural = 'Invitados'
        ordering = ['familia', 'nombre']

    def __str__(self):
        return f'{self.nombre} · {self.familia}'


class Confirmacion(models.Model):
    """Respuesta al formulario de asistencia (RSVP)."""

    OPCIONES = [
        ('si', 'Si asistiré'),
        ('no', 'No podré asistir'),
    ]

    nombre = models.CharField('Nombre', max_length=140)
    cedula = models.CharField('Cédula / Documento', max_length=20, blank=True)
    nombre_familia = models.CharField('Familia / Grupo', max_length=120, blank=True)
    correo = models.EmailField('Correo', blank=True)
    telefono = models.CharField('Teléfono', max_length=40, blank=True)
    pases = models.PositiveSmallIntegerField('Pases asignados', default=1)
    acompanantes = models.CharField('Acompañantes', max_length=300, blank=True)
    asistencia = models.CharField('Asistencia', max_length=4, choices=OPCIONES, default='si')
    menu = models.CharField('Menú', max_length=60, blank=True)
    alergias = models.CharField('Alergias o restricciones', max_length=400, blank=True)
    cancion = models.CharField('Canción que no puede faltar', max_length=200, blank=True)
    mensaje = models.TextField('Mensaje para los novios', blank=True)
    creada = models.DateTimeField('Recibida', auto_now_add=True)

    class Meta:
        verbose_name = 'Confirmación de asistencia'
        verbose_name_plural = 'Confirmaciones de asistencia'
        ordering = ['-creada']

    def __str__(self):
        return f'{self.nombre} · {self.get_asistencia_display()}'


class Mensaje(models.Model):
    """Mensajes y buenas deseos del libro de visitas digital."""

    autor = models.CharField('Autor', max_length=120)
    mensaje = models.TextField('Mensaje')
    creado = models.DateTimeField('Fecha', auto_now_add=True)

    class Meta:
        verbose_name = 'Mensaje de felicitacion'
        verbose_name_plural = 'Mensajes de felicitacion'
        ordering = ['-creado']

    def __str__(self):
        return f'{self.autor}'
