import type { APIDragon } from './DragCaveAPIWrapper';
interface AppConfig {
  port: number;
  apiPath: string;
  apiKey: string;
}

export type { APIDragon, AppConfig };
