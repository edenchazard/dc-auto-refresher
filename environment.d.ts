declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      DRAGCAVE_API_URL: string;
    }
  }
}
export {};
