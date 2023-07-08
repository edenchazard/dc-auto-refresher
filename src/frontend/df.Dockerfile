FROM node:lts
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
ENV MOUNT_PATH=
COPY ./package.json .
RUN npm install

EXPOSE ${FRONTEND_PORT}
ENTRYPOINT [ "npm", "run", "dev" ]