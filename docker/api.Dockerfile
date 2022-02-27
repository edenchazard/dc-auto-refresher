FROM node:lts-alpine3.14 as build
EXPOSE 8080
WORKDIR /app
COPY /src/backend/package.json .
RUN npm install
ENTRYPOINT [ "npm", "run", "dev" ]