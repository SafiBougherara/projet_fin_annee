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
    bash

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash && \
    mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Set working directory
WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies (will be done after copying composer files)
# RUN composer install --no-interaction --optimize-autoloader

# Expose port
EXPOSE 8000

# Start Symfony server
CMD ["symfony", "serve", "--no-tls", "--port=8000", "--listen-ip=0.0.0.0", "--allow-http"]
