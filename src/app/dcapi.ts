import type { Dragon } from './types';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + '/api';

interface APIResponse {
  errors: string[];
  data: {
    acceptable: boolean;
    justHatched: boolean;
    tod: number | null;
  };
}

export async function checkDragon(
  code: Dragon['code'],
  tod: Dragon['tod'] = null,
): Promise<APIResponse> {
  const url = `${API_URL}/check/${code}` + (tod === null ? '' : `?tod=${tod}`);
  const response = await fetch(url);

  if (!response.ok) throw new Error(response.statusText);

  const json = await response.json();
  return json;
}
