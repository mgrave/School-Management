# Etapa de construcción de Node.js
FROM node:alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa final con Nginx y Certbot
FROM nginx:1.25-alpine

# Copiar la aplicación Node.js desde la etapa anterior
COPY --from=builder /app /app

# Configurar Nginx
COPY nginx.conf /etc/nginx/nginx.conf


