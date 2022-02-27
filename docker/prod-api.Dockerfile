FROM node:lts-alpine3.14 as build
EXPOSE 80
WORKDIR /app
COPY --chown=node:node /src/backend/package*.json ./
RUN npm install
COPY --chown=node:node /src/backend .
USER node
ENTRYPOINT ["npm", "run", "prod"]