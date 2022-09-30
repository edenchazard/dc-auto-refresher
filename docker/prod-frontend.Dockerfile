# Build in intermediate container
FROM node:lts-alpine3.14 as build
WORKDIR /app
ENV NODE_ENV=production
ARG PUBLIC_URL
ENV PUBLIC_URL=$PUBLIC_URL
COPY ./src/frontend/package*.json ./
RUN npm install
COPY ./src/frontend .
RUN npm run build

# Copy build files to nginx
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/build /var/www/html
COPY ./docker/prod-nginx.conf /etc/nginx/conf.d/default.conf
