from django.contrib import admin

from .models import Confirmacion, Invitado, Mensaje


@admin.register(Invitado)
class InvitadoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'familia', 'telefono', 'correo', 'estado', 'creado', 'respondido')
    list_filter = ('estado', 'creado')
    search_fields = ('nombre', 'familia', 'correo', 'telefono')
    readonly_fields = ('token', 'creado', 'respondido')
    date_hierarchy = 'creado'


@admin.register(Confirmacion)
class ConfirmacionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'asistencia', 'pases', 'menu', 'creada')
    list_filter = ('asistencia', 'menu', 'creada')
    search_fields = ('nombre', 'correo', 'acompanantes', 'cancion')
    list_editable = ('asistencia',)
    date_hierarchy = 'creada'


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ('autor', 'mensaje', 'creado')
    search_fields = ('autor', 'mensaje')
    date_hierarchy = 'creado'
