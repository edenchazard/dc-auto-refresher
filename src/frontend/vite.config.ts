import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  console.log(env.VITE_PORT);

  return {
    base: env.VITE_APP_URL,
    server: {
      port: env.VITE_PORT,
      host: '0.0.0.0',
      proxy: {
        '^/api': {
          target: `http://api:${env.API_PORT}`,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    build: {
      outDir: './build',
    },
  };
});
