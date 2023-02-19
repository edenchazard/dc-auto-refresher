import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: env.VITE_APP_URL,
    server: {
      proxy: {
        '^/api': {
          target: 'http://api',
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    build: {
      outDir: './build',
    },
  });
};
