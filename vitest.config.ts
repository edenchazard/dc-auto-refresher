/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    environment: 'node',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
