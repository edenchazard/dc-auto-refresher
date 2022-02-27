# DC Fast Auto-Refresher Tool (aka FART)
Fast Auto Refreshing Tool, aka FART (yes, really!). Fart is an auto-refreshing tool with the following features:
- AR multiple dragons at varying rates through instances per refresh in a control-panel style format.
- Adjust settings even during auto refreshing.
- Control refresh speed.
- A small icon of the dragon you're ARing in the page tab. If you've got multiple dragons it even cycles through them. ;)
- Mobile-friendly.
- Calculate views per minute automatically (this is a bit fuzzy, it heavily depends on your connection, device and dragons).
- Smart removal - Leave FART on in the background and it'll remove dragons as soon as they've hatched or grown up.
        

## Running the project
Download docker.

### Dev
```docker-compose up```

### Production
Change PUBLIC_URL in `docker-compose.prod.yml` to the deployment url.

```docker-compose -f docker-compose.prod.yml up -d --build```