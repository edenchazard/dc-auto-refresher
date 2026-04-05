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

The project is dockerized, so all you need is Docker, Docker Compose, a clone of the repository, and access to the DragCave API.

```sh
# clone repo
git clone https://github.com/edenchazard/dc-auto-refresher.git

cd dc-auto-refresher

# copy config
cp .env.example .env

# add your DragCave API key
# BASE_URL should stay `/` for local development
nano .env
```

### Dev

From the project root, run the command:

```sh
docker compose up --build app
```

The app will be available at `http://localhost:3000`.

### Production

Build the production image:

```sh
docker build -f Dockerfile --build-arg BASE_URL=/dc/auto-refresher .
```

At runtime, provide `CLIENT_SECRET` and any host-specific `BASE_URL`, `HOST`, or `PORT` environment variables as needed.

### Tests

Run unit tests locally:

```sh
npm run test
```

Run end-to-end tests in the Docker test container:

```sh
docker compose --profile test up -d --build testapp
docker compose exec testapp npm run test:e2e
docker compose --profile test down --remove-orphans
```
