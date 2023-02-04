interface APIDragon {
  id: string;
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

interface APIResponse {
  errors: Array<[number, string]>;
  dragons: Record<string, APIDragon>;
}

interface DragonInferredDetails {
  isAdult: boolean;
  isDead: boolean;
  isHidden: boolean;
  isFrozen: boolean;
  justHatched: boolean;
  tod: number | null;
}

type Dragon = APIDragon & DragonInferredDetails;

interface AppConfig {
  port: number;
  apiPath: string;
  DCAPIURL: string;
  defaultError: { status: number; message: string };
}

export type {
  APIDragon,
  DragonInferredDetails,
  Dragon,
  AppConfig,
  APIResponse,
};
