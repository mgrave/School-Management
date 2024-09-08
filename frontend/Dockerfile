FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 5000
#CMD [ "npm", "run", "dev"]
CMD [ "serve", "-s", "dist" ]
