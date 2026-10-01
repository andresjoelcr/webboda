#!/usr/bin/env bash
# Construye el frontend y prepara Django para el despliegue.
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="${PYTHON:-python}"

echo "==> Instalando dependencias y compilando el frontend"
cd "$ROOT_DIR/frontend"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi
npm run build

echo "==> Instalando dependencias de Python"
cd "$ROOT_DIR"
"$PYTHON_BIN" -m pip install -r requirements.txt

echo "==> Reuniendo archivos estáticos en staticfiles/"
"$PYTHON_BIN" manage.py collectstatic --noinput

echo "==> Aplicando migraciones de la base de datos"
"$PYTHON_BIN" manage.py migrate --noinput

echo "==> Creando superusuario administrador si no existe"
"$PYTHON_BIN" manage.py shell -c "
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('ADMIN_USUARIO')
password = os.environ.get('ADMIN_PASSWORD')
email = os.environ.get('ADMIN_EMAIL') or ''
first_name = os.environ.get('ADMIN_NOMBRE', '')

if username and password and not User.objects.filter(username=username).exists():
    user = User.objects.create_superuser(username=username, email=email, password=password)
    user.first_name = first_name
    user.save(update_fields=['first_name'])
    print(f'Superusuario {username} creado con éxito.')
else:
    print('El superusuario ya existe o faltan ADMIN_USUARIO/ADMIN_PASSWORD.')
"

echo "==> Build completado"
