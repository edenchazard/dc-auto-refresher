FROM node:current-alpine as build
EXPOSE 8080
WORKDIR /app
COPY /src/backend/package.json .
RUN npm install