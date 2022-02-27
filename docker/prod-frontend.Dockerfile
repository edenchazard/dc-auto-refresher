FROM node:lts-alpine3.14 as build
ARG PUBLIC_URL
ENV PUBLIC_URL=$PUBLIC_URL
WORKDIR /app
COPY ./src/frontend/package*.json ./
RUN npm install
COPY ./src/frontend .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/build /var/www/html
COPY ./docker/prod-nginx.conf /etc/nginx/conf.d/default.conf
