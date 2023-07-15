# Build with TS
FROM node:lts-alpine as build
WORKDIR /app
ENV NODE_ENV=development
COPY ./tsconfig.json /package*.json ./src ./
RUN npm install && npm run build

# move our built files with ts stripped out
FROM node:lts-alpine as production
ARG USER="node"
ARG GROUP="node"
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package*.json /app/build ./
RUN npm ci

RUN  chown -R ${USER}:${GROUP} . && \
     chmod -R u=rx,g=rx,o= .

EXPOSE ${API_PORT}
USER ${USER}
ENTRYPOINT ["npm", "run", "prod"]