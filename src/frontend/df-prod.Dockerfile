# Build in intermediate container
FROM node:lts-alpine as build
WORKDIR /app
ARG MOUNT_PATH
ENV VITE_APP_URL=$MOUNT_PATH
COPY ./ ./
RUN npm ci && npm run build

# Copy build files to nginx
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/build /var/www/html
COPY --from=build /app/nginx-prod.conf /etc/nginx/conf.d/default.conf
