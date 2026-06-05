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

# Set working directory
WORKDIR /var/www/html

# Copy composer files first (cache layer optimization)
COPY composer.json composer.lock ./

# Install PHP dependencies (production, no dev)
RUN composer install --no-dev --no-interaction --optimize-autoloader --no-scripts

# Copy application source
COPY . .

# Run Symfony post-install scripts (cache, assets)
RUN APP_ENV=prod composer run-script post-install-cmd --no-interaction || true

# Clear and warm up Symfony cache for production
RUN APP_ENV=prod php bin/console cache:clear --no-debug || true
RUN APP_ENV=prod php bin/console cache:warmup --no-debug || true

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
RUN chown -R www-data:www-data /var/www/html/var

# Expose port
EXPOSE 8000

# Start both nginx and php-fpm via supervisord
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
