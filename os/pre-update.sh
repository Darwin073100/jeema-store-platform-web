#!/usr/bin/env bash
# Ejecutar ANTES de `git pull`.
#
# En Windows dejamos config.ts con `isProduction = false` a mano para poder
# levantar el proyecto en local, y el certificado QZ de public/qz queda
# modificado con el certificado propio de esta máquina. Ambos son archivos
# versionados, así que git los ve como "modified" y un `git pull` puede
# entrar en conflicto. Este script los revierte a la versión del último
# commit (descarta SOLO los cambios locales de estos dos archivos) para que
# el pull quede limpio.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

CONFIG_FILE="src/configuration/databases/typeorm/config/config.ts"
CERT_FILE="public/qz/digital-certificate.txt"

echo "Revirtiendo cambios locales antes del pull..."

git checkout -- "$CONFIG_FILE"
echo "  - $CONFIG_FILE restaurado al último commit."

git checkout -- "$CERT_FILE"
echo "  - $CERT_FILE restaurado al último commit."

echo "Listo. Ya puedes ejecutar: git pull"
