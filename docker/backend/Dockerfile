FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    bash \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip gd opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Allow Composer plugins (Symfony Flex) to run as root in Docker
ENV COMPOSER_ALLOW_SUPERUSER=1

# Set working directory
WORKDIR /var/www/html

# ── Step 1: Copy composer files only (cache layer optimization)
# Context is repo root, so backend/ prefix is needed
COPY backend/composer.json backend/composer.lock ./

# ── Step 2: Install dependencies WITHOUT scripts
# (bin/console doesn't exist yet — source not copied)
RUN composer install --no-dev --no-interaction --optimize-autoloader --no-scripts

# ── Step 3: NOW copy the full application source
COPY backend/ .

# Copy .env.example to .env to prevent Symfony Dotenv from failing when .env is missing
RUN cp .env.example .env

# ── Step 4: Run post-install scripts manually now that bin/console exists
RUN APP_ENV=prod php bin/console cache:clear --no-debug || true
RUN APP_ENV=prod php bin/console cache:warmup --no-debug || true

# ── Step 5: Generate JWT keypair so Symfony doesn't crash on startup
RUN apk add --no-cache openssl \
    && mkdir -p config/jwt \
    && openssl genrsa -out config/jwt/private.pem 4096 \
    && openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem \
    && chmod 644 config/jwt/private.pem config/jwt/public.pem

# Nginx configuration
RUN printf 'server {\n\
    listen 8000;\n\
    root /var/www/html/public;\n\
    index index.php;\n\
    location / {\n\
        try_files $uri /index.php$is_args$args;\n\
    }\n\
    location ~ \\.php$ {\n\
        fastcgi_pass 127.0.0.1:9000;\n\
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n\
        include fastcgi_params;\n\
    }\n\
}\n' > /etc/nginx/http.d/default.conf

# Supervisord configuration to run nginx + php-fpm together
RUN printf '[supervisord]\n\
nodaemon=true\n\
\n\
[program:php-fpm]\n\
command=php-fpm\n\
autostart=true\n\
autorestart=true\n\
\n\
[program:nginx]\n\
command=nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n' > /etc/supervisord.conf

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/var || true

# Expose port
EXPOSE 8000

# Start both nginx and php-fpm via supervisord
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
