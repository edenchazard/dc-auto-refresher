FROM node:24-bookworm-slim AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS prod-deps
COPY --link package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS build-deps
COPY --link package.json package-lock.json ./
RUN npm ci

FROM build-deps AS build
ARG BASE_URL=/dc/auto-refresher
ENV BASE_URL=$BASE_URL
COPY --link . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json
RUN mkdir -p /app/.astro && chown node:node /app/.astro

USER node

EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]
