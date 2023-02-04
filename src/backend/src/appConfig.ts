import type { AppConfig } from './types';
import settings from './config.json';

const config: AppConfig = {
  port: 80,
  apiPath: '/api',
  DCAPIURL: `https://dragcave.net/api/${settings.API_KEY}/json`,
  defaultError: { status: 2, message: 'Sorry, an error has occurred.' },
};

export default config;
