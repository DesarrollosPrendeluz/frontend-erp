# Usa la última versión de la imagen oficial de Node
#FROM node:23-bookworm
FROM node:20.18.0-bookworm

# Establece el directorio de trabajo en /app
WORKDIR /app
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
# Copia el package.json y package-lock.json para instalar dependencias
COPY . .

ARG BACK_HOST_NAME

# Instala las dependencias
RUN npm cache clean --force
#RUN rm -rf node_modules package-lock.json
RUN npm install
#RUN npm update
#RUN npm install @chakra-ui/react @chakra-ui/pin-input @chakra-ui/popper framer-motion



# Copia el resto de la aplicación
ENV NEXT_PUBLIC_BACKEND_API_URL=${BACK_HOST_NAME}

# Construye la aplicación Next.js
RUN npm run build 

#---
# Establece la variable de entorno HOST (puedes cambiar el valor por defecto aquí)
# ENV NEXT_PUBLIC_BACKEND_API_URL="http://127.0.0.1:8080"

# Expone el puerto 3000 para el servidor de Next.js
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
