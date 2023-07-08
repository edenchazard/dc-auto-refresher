declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_BASE_URL: string;
      NEXT_APP_VERSION: string;
    }
  }
}
export {};
