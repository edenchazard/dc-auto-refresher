import type { AppConfig } from './types';
import settings from './config.json';

const config: AppConfig = {
  port: 80,
  apiPath: '/api',
  apiKey: settings.API_KEY,
};

export default config;
