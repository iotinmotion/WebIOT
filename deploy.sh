#!/usr/bin/env bash
# Deploy de la web de IOT in Motion en el server propio (https://iotinmotion.com.ar).
#
# Uso, en el server como ubuntu:
#   ~/WebIOT/deploy.sh         baja los cambios y, si hace falta, recompila y reinicia
#   ~/WebIOT/deploy.sh --all   recompila y reinicia aunque no haya cambios
#
# Si el build falla, el script se corta antes de reiniciar.
# Detalle en el README, sección "Deploy en el server propio".
set -euo pipefail

PM2_NAME=web
PORT=3000
URL=https://iotinmotion.com.ar

cd "$(dirname "$(readlink -f "$0")")"

before=$(git rev-parse HEAD)
git pull --ff-only
changed=$(git diff --name-only "$before" HEAD)

if [ "${1:-}" != "--all" ]; then
  if [ -z "$changed" ]; then
    echo "No hay cambios nuevos. Para recompilar igual: $0 --all"
    exit 0
  fi
  # Archivos que no cambian lo publicado: docs y este script.
  if ! grep -qvE '\.md$|^deploy\.sh$|^\.gitattributes$' <<<"$changed"; then
    echo "Los cambios no afectan la web (por ejemplo, solo docs): no hay nada que publicar."
    exit 0
  fi
fi

if [ ! -d node_modules ] || grep -qE '^package(-lock)?\.json$' <<<"$changed"; then
  npm install
  # En el server el lockfile tiene que quedar igual al del repo; si npm lo reescribe,
  # el próximo git pull falla por "cambios locales".
  git diff --quiet -- package-lock.json || git checkout -- package-lock.json
fi

echo "== memoria antes del build"
free -h
npm run build

# Reinicio. No alcanza con "pm2 restart": a veces queda un next-server huérfano (fuera de
# PM2) ocupando el :3000, y el proceso nuevo choca con él y entra en loop de reinicios.
# Por eso se frena web, se mata cualquier next-server que haya quedado y recién ahí se
# vuelve a levantar. Ver CLAUDE.md, "Trampas propias de esta app".
echo "== reinicio"
pm2 stop "$PM2_NAME"
pkill -u "$(id -un)" -f 'next-server' || true
sleep 1
pm2 start "$PM2_NAME"

echo "== chequeo"
for _ in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/" || true)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "localhost:$PORT: $code"
curl -s -o /dev/null -w "$URL: %{http_code}\n" "$URL/" || true
pm2 list | grep -E "│ *$PM2_NAME " || true
