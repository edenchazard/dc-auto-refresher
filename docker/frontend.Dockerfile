FROM node:current-alpine
EXPOSE 80
WORKDIR /app
COPY /src/frontend/package.json .
RUN npm install