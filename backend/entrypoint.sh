#!/bin/sh

# Crear directorios necesarios
mkdir -p /etc/letsencrypt/live/api.nomadas.uk
mkdir -p /var/log/letsencrypt
mkdir -p /var/lib/letsencrypt

# Generar certificado temporal (solo para desarrollo)
if [ ! -f "/etc/letsencrypt/live/api.nomadas.uk/fullchain.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -subj "/CN=api.nomadas.uk" \
        -keyout /etc/letsencrypt/live/api.nomadas.uk/privkey.pem \
        -out /etc/letsencrypt/live/api.nomadas.uk/fullchain.pem
fi

# Iniciar Nginx en primer plano
nginx -g "daemon off;" &

# Esperar a que Nginx esté listo
sleep 5

# Obtener certificado Let's Encrypt
certbot --nginx --non-interactive --agree-tos --email htumba1105@gmail.com \
    -d api.nomadas.uk --redirect --test-cert

# Recargar configuración de Nginx
nginx -s reload

# Mantener el contenedor en ejecución
tail -f /dev/null