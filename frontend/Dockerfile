FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm i -g serve
COPY . .
RUN npm run build
#EXPOSE 8080
#Modo Desarrollo
#CMD [ "npm", "run", "dev"]
#Modo produccion
CMD [ "serve", "-s", "dist" ] 
