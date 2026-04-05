FROM node:lts-slim as base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base as prod-deps
RUN npm ci --omit=dev

FROM base as build-deps
RUN npm ci

FROM build-deps as build
COPY ./ ./
RUN npm run build

FROM base as final
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build --chown=astro:nodejs /app/dist ./dist

USER astro

EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
