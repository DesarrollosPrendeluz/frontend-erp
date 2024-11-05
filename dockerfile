# Usa la última versión de la imagen oficial de Node
FROM node:latest

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y package-lock.json para instalar dependencias
COPY . .

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación


# Construye la aplicación Next.js
RUN npm run build

# Establece la variable de entorno HOST (puedes cambiar el valor por defecto aquí)
ENV NEXT_PUBLIC_BACKEND_API_URL="http://127.0.0.1:8080"

# Expone el puerto 3000 para el servidor de Next.js
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
