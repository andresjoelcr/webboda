from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, HttpResponseServerError
from django.middleware.csrf import get_token

INDICE = Path(settings.BASE_DIR) / 'frontend' / 'dist' / 'index.html'


def app(request):
    """Sirve la aplicacion React compilada (frontend/dist)."""
    if not INDICE.exists():
        return HttpResponseServerError(
            '<h1>El frontend no esta compilado</h1>'
            '<p>Ejecuta <code>npm install</code> y <code>npm run build</code> '
            'dentro de la carpeta <code>frontend</code>.</p>'
        )

    respuesta = HttpResponse(INDICE.read_text(encoding='utf-8'), content_type='text/html; charset=utf-8')

    # El panel de administracion viaja como JSON: le entregamos la cookie
    # csrftoken para que el navegador pueda firmar sus peticiones.
    respuesta.set_cookie('csrftoken', get_token(request), samesite='Lax')

    return respuesta
