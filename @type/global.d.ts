declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    MONGO_RETRY_LIMIT: string;
    MONGO_RETRY_DELAY: string;
    CLIENT_URL: string;
    REDIS_HOST: string;
    NODE_ENV: string;
  }
}
