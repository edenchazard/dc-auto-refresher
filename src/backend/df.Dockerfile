FROM node:lts-alpine3.14 as build
EXPOSE 8080
WORKDIR /app
ENV NODE_ENV=development
COPY ./package.json .
RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]