# Build in intermediate container
FROM node:lts-alpine3.14 as build
WORKDIR /app
ENV NODE_ENV=production
ARG MOUNT_PATH
ENV PUBLIC_URL=$MOUNT_PATH
COPY ./ ./
RUN npm ci && npm run build

# Copy build files to nginx
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/build /var/www/html
COPY --from=build /app/nginx-prod.conf /etc/nginx/conf.d/default.conf
