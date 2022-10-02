FROM node:lts-alpine3.14
EXPOSE 80
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
ENV PUBLIC_URL=/
COPY ./package.json .
RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]