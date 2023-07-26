declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_APP_VERSION: string;
      API_KEY: string;
    }
  }
}
export {};
