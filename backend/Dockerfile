# Etapa de construcción de Node.js
FROM node:20-bullseye-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa final con Nginx y Certbot
FROM nginx:1.25-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache certbot certbot-nginx openssl

# Copiar la aplicación Node.js desde la etapa anterior
COPY --from=builder /app /app

# Configurar Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Configurar Certbot y SSL
RUN mkdir -p /etc/letsencrypt/live/api.nomadas.uk && \
    chmod -R 755 /etc/letsencrypt && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/letsencrypt/live/api.nomadas.uk/privkey.pem \
        -out /etc/letsencrypt/live/api.nomadas.uk/fullchain.pem \
        -subj "/CN=api.nomadas.uk"

# Script de inicio
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exponer puertos HTTP y HTTPS
EXPOSE 80 443

# Comando de inicio
CMD ["/entrypoint.sh"]
