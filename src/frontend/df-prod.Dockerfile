# Build in intermediate container
FROM node:lts-alpine as build
WORKDIR /app
ARG MOUNT_PATH
ENV VITE_APP_URL=$MOUNT_PATH
COPY ./ ./
RUN npm ci && npm run build

# Copy build files to nginx
FROM nginx:stable-alpine
ARG USER="sniff"
ARG GROUP="thistj09"

COPY --from=build /app/nginx-prod.conf.template /etc/nginx/nginx.conf.template
COPY --from=build /app/build /var/www/html

RUN  addgroup ${GROUP} && \
     adduser -D -G ${GROUP} ${USER} && \
     touch /var/run/nginx.pid && \
     chown -R ${USER}:${GROUP} /var/www/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run/nginx.pid && \
     chmod -R u=rx,g=rx,o= /var/www/html && \
     chmod u=rwx,g=r,o= /var/run/nginx.pid

# Run nginx conf substitutions
CMD ["/bin/sh", "-c", "envsubst '$FRONTEND_PORT $API_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

EXPOSE ${FRONTEND_PORT}

USER ${USER}