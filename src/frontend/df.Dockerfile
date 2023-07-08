FROM node:lts
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
ENV VITE_APP_URL=/
COPY ./package.json .
RUN npm install

EXPOSE ${VITE_PORT}
ENTRYPOINT [ "npm", "run", "start" ]