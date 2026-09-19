#!/usr/bin/env bash
# Carga los datos iniciales del sistema (roles, permisos, permisos por rol,
# tipos de transacción, roles de empleado y métodos de pago) definidos en
# src/configuration/databases/typeorm/scripts/initial-data-postgres-script.sql
# directamente contra la base de datos, sin tener que abrir pgAdmin a copiar
# y pegar el script a mano.
#
# Requiere:
#   - psql instalado y disponible en el PATH.
#   - un .env en la raíz del proyecto con la variable DATABASE_URL.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

ENV_FILE=".env"
SEED_FILE="src/configuration/databases/typeorm/scripts/initial-data-postgres-script.sql"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: no se encontró $ENV_FILE en la raíz del proyecto." >&2
  exit 1
fi

if [ ! -f "$SEED_FILE" ]; then
  echo "Error: no se encontró $SEED_FILE." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "Error: psql no está instalado o no está en el PATH." >&2
  exit 1
fi

DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ENV_FILE" | tail -n 1 | cut -d '=' -f2-)"

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL no está definida en $ENV_FILE." >&2
  exit 1
fi

echo "Ejecutando semilla de datos iniciales contra la base de datos..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SEED_FILE"

echo "Listo. Datos iniciales insertados."
