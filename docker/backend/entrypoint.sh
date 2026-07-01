#!/bin/sh
set -e

# Railway injects PORT; fallback to 8000 for local Docker
PORT="${PORT:-8000}"

echo "[entrypoint] Starting with PORT=$PORT, APP_ENV=${APP_ENV:-prod}"

# ── Dynamic Nginx config (uses $PORT) ─────────────────────────────────────────
cat > /etc/nginx/http.d/default.conf << NGINX_EOF
server {
    listen ${PORT};
    root /var/www/html/public;
    index index.php;

    # Forward real client IP from Railway's edge
    real_ip_header X-Forwarded-For;
    set_real_ip_from 0.0.0.0/0;

    location / {
        try_files \$uri /index.php\$is_args\$args;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 120;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX_EOF

echo "[entrypoint] Nginx config written for port $PORT"

# ── Fix permissions ────────────────────────────────────────────────────────────
chown -R www-data:www-data /var/www/html/var 2>/dev/null || true

# ── Clear & rebuild Symfony cache with REAL runtime env vars ──────────────────
cd /var/www/html

echo "[entrypoint] Clearing Symfony cache..."
php bin/console cache:clear --no-debug --env=prod 2>&1 || true

echo "[entrypoint] Warming up Symfony cache..."
php bin/console cache:warmup --no-debug --env=prod 2>&1 || true

# Fix permissions again after cache generation
chown -R www-data:www-data /var/www/html/var 2>/dev/null || true

echo "[entrypoint] Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
