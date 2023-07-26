import type { NextApiRequest, NextApiResponse } from 'next';
import { validateCode, inferDragon } from '../../../utils/utils';
import {
  APIDragon,
  DragCaveAPIError,
  DragCaveAPIWrapper,
} from '../../../utils/DragCaveAPIWrapper';

const api = new DragCaveAPIWrapper(process.env.API_KEY);

type ResponseData = {
  errors: string[];
  data?: {
    justHatched?: boolean;
    tod?: number | null;
    acceptable?: boolean;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | string>,
) {
  const code = (req.query.code as string) ?? '';
  const seconds: number | null = (function () {
    const param = new URL(
      req.url as string,
      `http://example.org`,
    ).searchParams.get('tod');

    return typeof param === 'string' ? Number(param) : null;
  })();

  const errors: ResponseData['errors'] = [];

  if (typeof code !== 'string') {
    errors.push('missing param');
    res.status(400).send({ errors });
  }

  if (!validateCode(code)) {
    errors.push('Invalid code.');
    res.status(400).send({ errors });
  }

  try {
    const response = await api.view(code);

    if (response.data === null) {
      const notFound = response.errors.find((e) => e.code === 3) !== undefined;
      const moreErrors = notFound
        ? // did not return a dragon
          [`The dragon doesn't exist.`]
        : // concat all error messages into one big 'un
          response.errors.map((e) => e.message).join(' ');
      res.status(200).send({ errors: [...errors, ...moreErrors] });
    }

    // a sum of data from the API, plus extra info derived
    // from the API data
    const dragon = inferDragon(response.data as APIDragon, seconds);

    res.json({
      errors,
      data: {
        acceptable: !dragon.isAdult && !dragon.isDead && !dragon.isFrozen,
        justHatched: dragon.justHatched,
        tod: dragon.tod,
      },
    });
  } catch (ex: unknown) {
    // we always know the information in these errors are safe
    // to show, so we can allow these to appear in the response.
    if (ex instanceof DragCaveAPIError) {
      errors.push(ex.message);
      res.status(400).send({ errors });
    }
    // any other exceptions, bubble up the stack
    throw ex;
  }
}
