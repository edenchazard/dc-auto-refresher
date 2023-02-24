import type Koa from 'koa';
import Router from '@koa/router';

import config from './appConfig';
import { DragCaveAPIError, DragCaveAPIWrapper } from './DragCaveAPIWrapper';
import { inferDragon, validateCode } from './utils';

const api = new DragCaveAPIWrapper(config.apiKey);

// api.addLogger(l => { })

const router = new Router<
  Koa.DefaultState,
  {
    body: {
      data: any;
      errors: string[];
    };
  }
>({ prefix: config.apiPath });

router.use(async (ctx, next) => {
  ctx.body = {
    errors: [],
    data: {},
  };

  await next();
});

router.get('/check/:code', async (ctx) => {
  const code = '' + ctx.params.code;

  // force a number or make it null
  const seconds = Number(ctx.query.tod);

  if (!validateCode(code)) {
    ctx.body.errors.push(`Invalid code.`);
    return;
  }

  try {
    const response = await api.view(code);

    if (response.data === null) {
      const notFound = response.errors.find((e) => e.code === 3) !== undefined;

      const errorMessage = notFound
        ? // did not return a dragon
          `The dragon doesn't exist.`
        : // concat all error messages into one big 'un
          response.errors.map((e) => e.message).join(' ');

      ctx.body.errors.push(errorMessage);
      return;
    }

    // a sum of data from the API, plus extra info derived
    // from the API data
    const dragon = inferDragon(response.data, seconds);

    ctx.body.data = {
      acceptable: !dragon.isAdult && !dragon.isDead && !dragon.isFrozen,
      justHatched: dragon.justHatched,
      tod: dragon.tod,
    };
  } catch (ex: unknown) {
    // we always know the information in these errors are safe
    // to show, so we can allow these to appear in the response.
    if (ex instanceof DragCaveAPIError) {
      ctx.body.errors.push(ex.message);
    }
    // any other exceptions, bubble up the stack
    throw ex;
  }
});

export { router };
