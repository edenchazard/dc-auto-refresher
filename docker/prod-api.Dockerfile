# Build with TS
FROM node:lts-alpine3.14 as build
EXPOSE 80
WORKDIR /app
COPY --chown=node:node /src/backend/tsconfig.json ./
COPY --chown=node:node /src/backend/package*.json ./
COPY --chown=node:node ./src/backend/src ./
RUN npm install
RUN npm run build

# move our built files with ts stripped out
FROM node:lts-alpine3.14 as production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/package*.json .
COPY --from=build --chown=node:node /app/build .
RUN npm install
USER node
ENTRYPOINT ["npm", "run", "prod"]