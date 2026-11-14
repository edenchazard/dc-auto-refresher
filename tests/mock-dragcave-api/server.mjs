import { createServer } from 'node:http';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 3100);

// Fixtures live only in this server process and are reset when it restarts.
const dragons = new Map();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  res.setHeader('content-type', 'application/json');

  if (url.pathname === '/health') {
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'PUT' && url.pathname === '/fixtures/dragon') {
    let dragon;
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      dragon = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Request body must be valid JSON.' }));
      return;
    }

    if (
      dragon === null ||
      typeof dragon !== 'object' ||
      Array.isArray(dragon) ||
      typeof dragon.id !== 'string' ||
      !/^[a-zA-Z0-9]+$/.test(dragon.id)
    ) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({ error: 'Dragon fixture must have a valid id.' }),
      );
      return;
    }

    dragons.set(dragon.id, dragon);
    res.statusCode = 201;
    res.end(JSON.stringify({ dragon }));
    return;
  }

  const match = url.pathname.match(/^\/api\/v2\/dragon\/([a-zA-Z0-9]+)$/);
  const dragon = match === null ? undefined : dragons.get(match[1]);

  if (dragon === undefined) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        errors: [[3, 'Dragon not found.']],
        dragons: {},
      }),
    );
    return;
  }

  res.end(
    JSON.stringify({
      errors: [],
      dragons: { [dragon.id]: dragon },
    }),
  );
});

server.listen(port, host, () => {
  console.log(`Mock DragCave API listening on http://${host}:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
