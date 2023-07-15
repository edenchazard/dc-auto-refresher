import type { AppConfig } from './types';
import settings from './config.json';

import * as dotenv from 'dotenv';
dotenv.config();

const config: AppConfig = {
  port: process.env['API_PORT'] ? parseInt(process.env['API_PORT']) : 8080,
  apiPath: '/api',
  apiKey: settings.API_KEY,
};

export default config;
