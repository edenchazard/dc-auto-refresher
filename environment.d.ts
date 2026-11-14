declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      DRAGCAVE_API_BASE_URL?: string;
    }
  }
}
export {};
