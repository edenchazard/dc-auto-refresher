import { createServer } from 'node:http';

const port = Number(process.env.MOCK_DRAGCAVE_PORT ?? 3100);

// A young dragon that is eligible for auto-refreshing.
const dragons = {
  abcde: {
    id: 'abcde',
    name: 'Test Dragon',
    owner: 'tester',
    start: '2026-11-14T00:00:00Z',
    hatch: '0',
    grow: '0',
    death: '0',
    views: 1,
    unique: 1,
    clicks: 0,
    gender: '',
    hoursleft: 24,
    parent_f: '',
    parent_m: '',
  },
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  res.setHeader('content-type', 'application/json');

  if (url.pathname === '/health') {
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const match = url.pathname.match(/^\/api\/v2\/dragon\/([a-zA-Z0-9]+)$/);
  const dragon = match === null ? undefined : dragons[match[1]];

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

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock DragCave API listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
