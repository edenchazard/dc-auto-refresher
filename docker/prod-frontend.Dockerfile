FROM node:current-alpine as build
EXPOSE 80
WORKDIR /app
COPY /src/frontend/package.json .
RUN npm install
COPY /src/frontend .
RUN npm run build

FROM nginx:latest
COPY --from=build /app/build /var/www/html
COPY ./docker/prod-nginx.conf /etc/nginx/conf.d/default.conf