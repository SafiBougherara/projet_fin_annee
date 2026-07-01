#!/bin/sh
set -ex

# Always use port 8000 to match EXPOSE 8000 in Dockerfile.
# Railway routes to EXPOSE port, so we must listen on the same port.
PORT=8000

echo "[entrypoint] PORT=${PORT}"
echo "[entrypoint] APP_ENV=${APP_ENV:-not set}"
echo "[entrypoint] Writing nginx config..."

cat > /etc/nginx/http.d/default.conf << 'NGINX_TEMPLATE'
server {
    listen 8000;
    root /var/www/html/public;
    index index.php;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_read_timeout 120;
        fastcgi_intercept_errors on;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX_TEMPLATE

echo "[entrypoint] Validating nginx config..."
nginx -t

echo "[entrypoint] Fixing permissions..."
chown -R www-data:www-data /var/www/html/var 2>/dev/null || true

echo "[entrypoint] Clearing Symfony cache..."
cd /var/www/html
php bin/console cache:clear --no-debug --env=prod 2>&1 || true

echo "[entrypoint] Warming up Symfony cache..."
php bin/console cache:warmup --no-debug --env=prod 2>&1 || true

chown -R www-data:www-data /var/www/html/var 2>/dev/null || true

echo "[entrypoint] Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
