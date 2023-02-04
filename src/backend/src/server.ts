// normally I would refactor this script but it's sooooo small
import config from './appConfig';
import Koa from 'koa';
import Router from '@koa/router';
import axios from 'axios';
import type { APIDragon, APIResponse, DragonInferredDetails } from './types';

const app = new Koa();
const router = new Router({ prefix: config.apiPath });

function validateCode(code: string): boolean {
  return /^[a-zA-Z0-9]{5}$/.test(code);
}

// Function to validate API response from dragcave
// Only checks the fields we need.
function validAPIDragon(responseObj: APIDragon): boolean {
  let pass = true;
  ['grow', 'death', 'start', 'hatch', 'hoursleft'].forEach((prop) => {
    if (!(prop in responseObj)) {
      pass = false;
    }
  });

  return pass;
}

// Determines various characteristics about a dragon
function determineDragonDetails(
  dragon: APIDragon,
  seconds: number,
): DragonInferredDetails {
  // We need to compare the current seconds passed this hour with that of
  // what the user inputted, then we set the tod to the current date +
  // the hours, mins and seconds of the dragon remaining
  const calculateTOD = (hoursLeft: number, seconds: number): number | null => {
    if (hoursLeft === -1) return null;

    const now = new Date();
    const a = now.getUTCMinutes() * 60 + now.getUTCSeconds();

    // is hoursleft rounded? let's find out
    const hours = now.getUTCHours() + hoursLeft;
    const roundedHours = a >= seconds ? hours : hours - 1;

    // create the date in the future
    const tod = new Date();
    tod.setUTCHours(roundedHours, Math.floor(seconds / 60), seconds % 60);

    // console.log('user specified date ' + tod);

    return tod.getTime();
  };

  const isAdult = dragon.grow !== '0';
  const isDead = dragon.death !== '0';
  const isHidden =
    dragon.start === '0' && dragon.hatch === '0' && dragon.death === '0';
  const isFrozen = !isAdult && !isDead && !isHidden && dragon.hoursleft === -1;
  const justHatched = dragon.hoursleft === 168 && dragon.hatch !== '0';

  const tod = seconds !== null ? calculateTOD(dragon.hoursleft, seconds) : null;

  const inferred: DragonInferredDetails = {
    isAdult,
    isDead,
    isHidden,
    isFrozen,
    justHatched,
    tod,
  };
  return inferred;
}

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

router.get('/check/:code', async (ctx) => {
  const code: string = ctx.params.code;

  // force a number or make it null
  const seconds = Number(ctx.query.tod);

  if (!validateCode(code)) {
    // todo maybe this should be changed, as it's not really an API error.
    throw new APIError("The code isn't valid.");
  }

  const dcAPI = await axios.get<APIResponse>(config.DCAPIURL + '/view/' + code);
  const response = dcAPI.data;

  if (response.errors.length > 0) {
    throw new APIError(
      "The dragon doesn't exist or there's an issue with dragcave.net.",
    );
  }

  if (!validAPIDragon(response.dragons[code])) {
    throw new APIError("The dragon data received isn't valid.");
  }

  // extra info about the dragon based on response
  const dragon = {
    ...response,
    ...determineDragonDetails(response.dragons[code], seconds),
  };

  ctx.body = {
    errors: false,
    acceptable: !dragon.isAdult && !dragon.isDead && !dragon.isFrozen,
    justHatched: dragon.justHatched,
    tod: dragon.tod,
  };
});

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      ctx.status = 500;
      if (err instanceof APIError) {
        ctx.body = { errors: true, errorMessage: err.message };
      } else {
        // all other errors
        ctx.body = {
          errors: true,
          errorMessage: 'Sorry, an error has occurred.',
        };
      }
      console.log(err);
    }
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.port);

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
