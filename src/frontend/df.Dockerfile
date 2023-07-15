FROM node:lts
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
ENV MOUNT_PATH=
COPY ./package.json .
RUN npm install

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "dev" ]