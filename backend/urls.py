from django.urls import path

from . import views

app_name = 'backend'

urlpatterns = [
    path('invitacion/', views.invitacion, name='invitacion'),
    # Enlace personal del invitado: /api/invitado/<token>/
    path('invitado/sesion/', views.invitado_sesion, name='invitado_sesion'),
    path('invitado/<slug:token>/', views.invitado, name='invitado'),
    path('rsvp/', views.rsvp, name='rsvp'),
    path('rsvp/cancelar/', views.rsvp_cancelar, name='rsvp_cancelar'),
    path('felicitaciones/', views.felicitaciones, name='felicitaciones'),
    path('felicitacion/', views.felicitacion, name='felicitacion'),
    # Panel de administracion (/loginadmin y /dashboaradmin)
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
    path('admin/sesion/', views.admin_sesion, name='admin_sesion'),
    path('admin/invitados/', views.admin_invitados, name='admin_invitados'),
    path('admin/invitados/crear/', views.admin_invitado_crear, name='admin_invitado_crear'),
    path(
        'admin/invitados/<int:pk>/',
        views.admin_invitado_borrar,
        name='admin_invitado_borrar',
    ),
    path('admin/resumen/', views.admin_resumen, name='admin_resumen'),
]
