FROM node:26.13.1-trixie-slim

WORKDIR /app

COPY --link server.mjs ./

HEALTHCHECK --interval=2s --timeout=2s --start-period=5s --retries=15 \
  CMD node -e "fetch('http://127.0.0.1/health').then((res) => process.exit(res.ok ? 0 : 1), () => process.exit(1))"

CMD ["node", "server.mjs"]
