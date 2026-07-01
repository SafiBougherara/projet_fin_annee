# Base image using PHP FPM Alpine
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

# Create a minimal .env for build-time commands only (no CORS/secrets — Railway injects those at runtime)
RUN echo "APP_ENV=prod" > .env && echo "APP_SECRET=build_placeholder" >> .env

# ── Step 4: Run composer post-install scripts (autoload optimization)
RUN APP_ENV=prod composer dump-autoload --optimize --no-dev 2>/dev/null || true

# ── Step 5: Generate JWT keypair so Symfony doesn't crash on startup
RUN apk add --no-cache openssl \
    && mkdir -p config/jwt \
    && openssl genrsa -out config/jwt/private.pem 4096 \
    && openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem \
    && chmod 644 config/jwt/private.pem config/jwt/public.pem

# Nginx configuration — written dynamically at runtime by entrypoint.sh (uses $PORT)
# Supervisord configuration to run nginx + php-fpm together
RUN printf '[supervisord]\nnodaemon=true\nlogfile=/dev/stdout\nlogfile_maxbytes=0\n\n[program:php-fpm]\ncommand=php-fpm\nautostart=true\nautorestart=true\nstdout_logfile=/dev/stdout\nstdout_logfile_maxbytes=0\nstderr_logfile=/dev/stderr\nstderr_logfile_maxbytes=0\n\n[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true\nstdout_logfile=/dev/stdout\nstdout_logfile_maxbytes=0\nstderr_logfile=/dev/stderr\nstderr_logfile_maxbytes=0\n' > /etc/supervisord.conf

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/var || true

# Copy entrypoint script (handles PORT, nginx config, cache warmup at runtime)
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose default port (Railway may override via PORT env var)
EXPOSE 8000

# Entrypoint handles nginx config + cache clear, then starts supervisord
CMD ["/entrypoint.sh"]
