
# Prendeluz Frontend ERP
Frontend Prendeluz Erp  
*Se requiere tener node instalado en el equipo, esto es un proyecto de Next.js*



## Installation

Install and run in develop enviroments

```bash
  npm install
  npm run dev
```

## Run docker image
Revisar la ruta hacia la que hace las peticiones el en o en este caso el archivo dockerfile

```bash
  docker build -t frontend-erp-prod .
  docker run -p 3000:3000 -e HOST=0.0.0.0 frontend-erp-prod
```
## Upload image to Dockerhub

```bash
  docker tag frontend-erp-prod desarrollospr/frontend-erp-prod:1.1.0 ... (tags varios)
  docker push desarrollospr/frontend-erp-prod:1.1.0  (tags varios)
```

## Upload image to Plesk via Ssh

```bash
  docker login
  docker pull ...
  
```
*En plesk vincular al puerto 3333*
Hay que vincular mediante el docker proxy con el dominio que se desee usar.
    