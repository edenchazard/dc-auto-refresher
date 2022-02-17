FROM node:current-alpine as build
EXPOSE 80
WORKDIR /app
COPY /src/backend/package.json .
RUN npm install
COPY /src/backend .