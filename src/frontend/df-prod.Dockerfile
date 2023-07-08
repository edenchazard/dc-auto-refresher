# Build in intermediate container
FROM node:lts-alpine as build
WORKDIR /app
ARG MOUNT_PATH
ARG APP_VERSION
ENV NEXT_BASE_URL=$MOUNT_PATH
ENV NEXT_APP_VERSION=${APP_VERSION}
COPY ./ ./
RUN npm ci && npm run build

# Copy build files to optimised container
FROM node:lts-alpine as final
WORKDIR /app
ARG USER="sniff"
ARG GROUP="thistj09"

#COPY --from=build /app/nginx-prod.conf.template /etc/nginx/nginx.conf.template
COPY --from=build /app/.next /app

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

RUN  addgroup ${GROUP} && \
     adduser -D -G ${GROUP} ${USER} && \
     #touch /var/run/nginx.pid && \
     chown -R ${USER}:${GROUP} /app
     #/var/www/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run/nginx.pid && \
#     chmod -R u=rx,g=rx,o= /var/www/html && \
#     chmod u=rwx,g=r,o= /var/run/nginx.pid

# Run nginx conf substitutions
#CMD ["/bin/sh", "-c", "envsubst '$FRONTEND_PORT $API_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

EXPOSE ${NEXT_PORT}

USER ${USER}