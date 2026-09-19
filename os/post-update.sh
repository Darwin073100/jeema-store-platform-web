#!/usr/bin/env bash
# Ejecutar DESPUÉS de `git pull`.
#
# Deja el entorno listo para trabajar en local en Windows:
#   1. config.ts vuelve a `isProduction = false` (en Linux/producción esa
#      línea debe quedar como `process.env.NODE_ENV === 'production'`, tal
#      como llega del commit).
#   2. Se copia el certificado QZ propio de esta máquina (carpeta
#      qz-certificate/ en la raíz, fuera de git) sobre public/qz, pisando el
#      que vino en el commit.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

CONFIG_FILE="src/configuration/databases/typeorm/config/config.ts"
SRC_CERT="qz-certificate/digital-certificate.txt"
DEST_CERT="public/qz/digital-certificate.txt"

echo "Ajustando config.ts para desarrollo local..."
sed -i "s/^const isProduction = process\.env\.NODE_ENV === 'production';$/const isProduction = false;/" "$CONFIG_FILE"
echo "  - $CONFIG_FILE -> isProduction = false"

if [ -f "$SRC_CERT" ]; then
  cp "$SRC_CERT" "$DEST_CERT"
  echo "  - $DEST_CERT actualizado con el certificado local ($SRC_CERT)"
else
  echo "  - Aviso: no se encontró $SRC_CERT, se omite la copia del certificado."
fi

echo "Listo. Entorno local restaurado tras el pull."
