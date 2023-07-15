# Build in intermediate container
FROM node:lts-alpine as build
WORKDIR /app
ARG MOUNT_PATH
ARG APP_VERSION
ARG API_KEY
ENV NEXT_PUBLIC_BASE_URL=${MOUNT_PATH}
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION}
ENV API_KEY=${API_KEY}
COPY ./ ./
RUN npm ci && npm run build

# Copy build files to optimised container
FROM node:lts-alpine as final
WORKDIR /app
ENV NODE_ENV=production

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]