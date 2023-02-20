import Koa from 'koa';
import config from './appConfig';
import { router } from './router';

const app = new Koa();

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      // Handle errors so we don't break our node process
      ctx.body = {
        errors: ['Sorry, an error has occurred.'],
        data: {},
      };
      console.log(err);
    }
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.port);

process.on('unhandledRejection', (err) => {
  // TODO handle proper error logging
  console.log(err);
  process.exit(1);
});
