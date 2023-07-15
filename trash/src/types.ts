import type {APIDragon}

interface AppConfig {
  port: number;
  apiPath: string;
  apiKey: string;
}

export type { APIDragon, AppConfig };
