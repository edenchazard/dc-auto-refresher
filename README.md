# DC Fast Auto-Refresher Tool (aka FART)

Fast Auto Refreshing Tool, aka FART (yes, really!). Fart is an open-source auto-refreshing tool with the following features:

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

Download docker.

### Dev

1. Rename `/src/backend/src/config.example.ts` to `config.ts` and insert API key.
2. Run:

```sh
docker-compose up
```

### Production

1. Change MOUNT_PATH in `docker-compose.prod.yml` to the deployment url.
2. Rename `/src/backend/src/config.example.ts` to `config.ts` and insert API key.
3. Run:

```sh
docker-compose -f docker-compose.prod.yml up -d --build
```
