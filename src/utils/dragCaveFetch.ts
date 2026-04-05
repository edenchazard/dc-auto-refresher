import { createFetch } from 'ofetch';

export type DragonCode = string;

export interface APIDragon {
  id: DragonCode;
  name: string | null;
  owner: string;
  start: string;
  hatch: string | number;
  grow: string | number;
  death: string | number;
  views: number;
  unique: number;
  clicks: number;
  gender: '' | 'Male' | 'Female';
  hoursleft: number;
  parent_f: string;
  parent_m: string;
}

export type DragCaveApiResponse<Data> = {
  errors: Array<[number, string]>;
} & Data;

export function dragCaveFetch() {
  console.log(import.meta.env.CLIENT_SECRET);
  return createFetch({
    defaults: {
      baseURL: 'https://dragcave.net/api/v2',
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${import.meta.env.CLIENT_SECRET}`,
      },
    },
  });
}
