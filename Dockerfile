# ----- ETAPA 1: BUILD -----
# Usamos una imagen de Node con el build-kit de TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias de desarrollo
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto de TypeScript
RUN npm run build

# ----- ETAPA 2: PRODUCTION -----
# Usamos una imagen slim para producción
FROM node:18-alpine

WORKDIR /app

# Definimos el entorno de producción
ENV NODE_ENV=production

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos SOLO dependencias de producción
RUN npm install --only=production

# Copiamos el build de la etapa anterior
COPY --from=builder /app/dist ./dist

# Expone el puerto que usará tu app (ej. 3000)
EXPOSE 3000

# Comando para correr la aplicación
CMD ["node", "dist/server.js"]