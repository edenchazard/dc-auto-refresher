FROM node:lts
WORKDIR /app
ENV NODE_ENV=development
COPY ./package.json .
RUN npm install

EXPOSE ${API_PORT}
ENTRYPOINT [ "npm", "run", "dev" ]