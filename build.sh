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

echo "==> Build completado"
