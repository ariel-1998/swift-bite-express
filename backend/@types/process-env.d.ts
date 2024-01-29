// import { User as UserModel } from "../src/models/user";
//need to change tsconfig options to remove export
export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      COOKIE_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      // GOOGLE_API_KEY: string;
      // GOOGLE_GEOCODEING_BASE_URL: string;
      ENV: "test" | "dev" | "prod";
      NODE_ENV: "production" | "test" | undefined;
    }
  }
}
