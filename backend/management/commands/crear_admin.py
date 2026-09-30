"""Crea (o actualiza) el usuario administrador del panel desde el .env."""

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


class Command(BaseCommand):
    help = 'Crea o actualiza el administrador del panel usando ADMIN_* del .env'

    def add_arguments(self, parser):
        parser.add_argument(
            '--password',
            dest='clave',
            default=None,
            help='Contrasena a usar en lugar de ADMIN_PASSWORD',
        )

    @transaction.atomic
    def handle(self, *args, **opciones):
        Usuario = get_user_model()

        nombre = settings.ADMIN_USUARIO
        clave = opciones['clave'] or settings.ADMIN_PASSWORD
        if not nombre or not clave:
            raise CommandError(
                'Faltan ADMIN_USUARIO o ADMIN_PASSWORD en el archivo .env'
            )

        usuario, creado = Usuario.objects.get_or_create(
            username=nombre,
            defaults={
                'email': settings.ADMIN_EMAIL,
                'first_name': settings.ADMIN_NOMBRE,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            },
        )

        cambios = []
        if creado:
            cambios.append('creado')
        else:
            if not usuario.is_staff or not usuario.is_active:
                usuario.is_staff = True
                usuario.is_active = True
                cambios.append('permisos actualizados')
            if usuario.email != settings.ADMIN_EMAIL:
                usuario.email = settings.ADMIN_EMAIL
                cambios.append('correo actualizado')

        usuario.set_password(clave)
        cambios.append('contrasena actualizada')
        usuario.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'Administrador {nombre}: {", ".join(cambios)} (id={usuario.pk})'
            )
        )
