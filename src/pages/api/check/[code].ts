import type { APIRoute } from 'astro';
import { validateCode, inferDragon } from '../../../utils/utils';
import {
  dragCaveFetch,
  type APIDragon,
  type DragCaveApiResponse,
} from '../../../utils/dragCaveFetch';

type ResponseData = {
  errors: string[];
  data?: {
    justHatched?: boolean;
    tod?: number | null;
    acceptable?: boolean;
  };
};

function jsonResponse(status: number, body: ResponseData | string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.CLIENT_SECRET}`,
    },
  });
}

export const GET: APIRoute = async ({ params, request }) => {
  const code = params.code ?? '';
  const param = new URL(request.url).searchParams.get('tod');
  const seconds = typeof param === 'string' ? Number(param) : null;
  const errors: ResponseData['errors'] = [];

  if (!validateCode(code)) {
    errors.push('Invalid code.');
    return jsonResponse(400, { errors });
  }

  try {
    const response = await dragCaveFetch()<
      DragCaveApiResponse<{ dragons: Record<string, APIDragon> }>
    >(`/dragon/${code}`);

    if (response.errors.length > 0) {
      return jsonResponse(200, {
        errors: response.errors.map(([, message]) => message),
      });
    }

    // a sum of data from the API, plus extra info derived
    // from the API data
    const dragon = inferDragon(response.dragons[code] as APIDragon, seconds);

    return jsonResponse(200, {
      errors,
      data: {
        acceptable: !dragon.isAdult && !dragon.isDead && !dragon.isFrozen,
        justHatched: dragon.justHatched,
        tod: dragon.tod,
      },
    });
  } catch (ex: unknown) {
    return jsonResponse(400, { errors: ['Sorry, an error occurred.'] });
  }
};
