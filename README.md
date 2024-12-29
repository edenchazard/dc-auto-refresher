# DC Fast Auto-Refresher Tool (aka FART)

Fast Auto Refreshing Tool, aka FART (yes, really!). Fart is an open-source auto-refreshing tool for [dragcave.net](https://dragcave.net).

![screenshot](https://i.imgur.com/gPYMhME.png)

## Features

- AR multiple dragons at varying rates through instances per refresh in a simple control-panel style format.
- Control refresh speed.
- A small icon of the dragon you're ARing in the page tab. If you've got multiple dragons it even cycles through them. ;)
- Mobile-friendly.
- State persistence - even if you're clumsy (like @MissK.) and refresh, FART won't lose your settings. 😎
- Calculate views per minute (this is a bit fuzzy, it depends on your connection, device and dragons).
- Smart removal - Leave FART on in the background and it'll remove dragons as soon as they've hatched or grown up.
- Set up now and save a link to share or come back to it later. Excellent for NDs when you want to be prepared in advance.
- TOD countdown - Tell FART when the dragon's timer changes and FART will give you a TOD countdown.

## Running the project

The project is dockerized, so all you need is docker, docker-compose, a clone of the repository and access to the DC API. You can then choose to run the development or production compose files.

```sh
# clone repo
git clone https://github.com/edenchazard/dc-auto-refresher.git

cd dc-auto-refresher

# copy config
cp .env.example .env

# edit with your favorite text editor
# and put in your API key.
nano .env
```

### Dev

From the project root, run the command:

```sh
docker-compose up
```

### Production

1. Change MOUNT_PATH in docker-compose.prod.yml to the deployment url. e.g. If you want it to be available at example.org/fart, you'd use "/fart".
2. From the project root, run the command:

```sh
docker-compose -f docker-compose.prod.yml up -d --build
```
