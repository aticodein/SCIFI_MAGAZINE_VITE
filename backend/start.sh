#!/bin/sh
set -e

# Default port for platforms like Railway/Render/Heroku.
PORT_VALUE="${PORT:-8080}"

echo "[startup] Running migrations..."
python manage.py migrate --noinput

# Whitenoise Manifest storage expects collected static files in production.
# This is safe to run on every boot; it will be fast when unchanged.
echo "[startup] Collecting static files..."
python manage.py collectstatic --noinput || true

echo "[startup] Starting gunicorn on :${PORT_VALUE}"
exec gunicorn sci_fi_magazine.wsgi:application --bind "0.0.0.0:${PORT_VALUE}" --workers "${GUNICORN_WORKERS:-2}" --timeout "${GUNICORN_TIMEOUT:-60}"
