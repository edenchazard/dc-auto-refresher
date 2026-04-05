FROM node:24.14-bookworm-slim AS base
WORKDIR /app

FROM base AS build
COPY --link package.json package-lock.json ./
ARG BASE_URL=/dc/auto-refresher
ENV BASE_URL=$BASE_URL
COPY --link . .
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production 
WORKDIR /app

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
