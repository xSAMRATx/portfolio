# Image for the "app" service: PHP-FPM + Composer for Laravel 12.
# Every line below is one step. Docker caches steps, so rebuilding is fast
# unless you change a line (then that step and the ones after it re-run).

# 1. Start from the official PHP image. 8.5 = newest PHP that Laravel 12 supports.
#    "fpm" = FastCGI server for nginx. "alpine" = small Linux (~30 MB).
FROM php:8.5-fpm-alpine

# 2. Add the PHP extension Laravel needs to talk to MySQL.
#    (Most others — mbstring, openssl, pdo, tokenizer… — are already built in.)
RUN docker-php-ext-install pdo_mysql

# 3. Copy the Composer program from the official Composer image.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Our PHP settings (bigger upload limit for the CV PDF).
COPY php.ini /usr/local/etc/php/conf.d/zz-portfolio.ini

# 5. Create a user with the SAME id as you on your computer, so files written
#    into backend/ (storage/logs, vendor/…) are owned by you, not root.
SHELL ["/bin/ash", "-eo", "pipefail", "-c"]
ARG HOST_UID=1000
ARG HOST_GID=1000
#    (If a group with your id already exists in the image, we reuse it.)
RUN getent group "${HOST_GID}" > /dev/null || addgroup -g "${HOST_GID}" app \
 && GROUP_NAME="$(getent group "${HOST_GID}" | cut -d: -f1)" \
 && adduser -D -u "${HOST_UID}" -G "${GROUP_NAME}" app \
 && sed -i "s/^user = .*/user = app/; s/^group = .*/group = ${GROUP_NAME}/" /usr/local/etc/php-fpm.d/www.conf

# 6. The folder where compose.yaml mounts backend/.
WORKDIR /var/www/html

# 7. Run as that user (by id) from now on: php-fpm, composer, artisan.
USER ${HOST_UID}:${HOST_GID}

# 8. php-fpm listens on port 9000 (nginx connects to app:9000).
EXPOSE 9000
CMD ["php-fpm"]
