# Build with TS
FROM node:lts-alpine as build
WORKDIR /app
ENV NODE_ENV=development
COPY ./tsconfig.json /package*.json ./src ./
RUN npm install && npm run build

# move our built files with ts stripped out
FROM node:lts-alpine as production
EXPOSE 80
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/package*.json /app/build ./
RUN npm ci
USER node

ENTRYPOINT ["npm", "run", "prod"]