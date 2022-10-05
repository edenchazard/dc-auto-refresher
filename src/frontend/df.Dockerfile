FROM node:lts-alpine
EXPOSE 80
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
ENV VITE_APP_URL=/
COPY ./package.json .
RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]