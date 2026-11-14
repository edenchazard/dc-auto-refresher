import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  eslintConfigPrettier,
  globalIgnores([
    '**/.next/**',
    '**/node_modules/**',
    '**/bin/**',
    '**/build/**',
    '**/dist/**',
    '**/trash/**',
    'out/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
