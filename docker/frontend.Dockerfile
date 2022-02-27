FROM node:lts-alpine3.14
EXPOSE 80
WORKDIR /app
COPY /src/frontend/package.json .
RUN npm install
ENTRYPOINT [ "npm", "run", "start" ]