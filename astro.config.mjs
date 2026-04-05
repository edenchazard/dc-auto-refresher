import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  base: '/dc/auto-refresher',
  trailingSlash: 'never',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
});
