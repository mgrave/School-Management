#!/bin/sh

# Iniciar Nginx en segundo plano
# nginx -g "daemon off;" &

# Generar certificado temporal (solo para desarrollo)
if [ ! -f "/etc/letsencrypt/live/api.nomadas.uk/fullchain.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/letsencrypt/live/api.nomadas.uk/privkey.pem \
        -out /etc/letsencrypt/live/api.nomadas.uk/fullchain.pem \
        -subj "/CN=api.nomadas.uk"
fi

# Obtener certificado Let's Encrypt (producción)
certbot --nginx --non-interactive --agree-tos --email htumba1105@gmail.com \
    -d api.nomadas.uk --redirect --test-cert

# Reiniciar Nginx con nueva configuración
nginx -s reload

# Mantener el contenedor en ejecución
tail -f /dev/null