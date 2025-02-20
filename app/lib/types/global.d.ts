declare namespace NodeJS {
  interface ProcessEnv {
    APP_ENV?: 'development' | 'staging' | 'production';
    AUTH_GOOGLE_ID?: string;
    AUTH_GOOGLE_SECRET?: string;
    API_BASE_URL?: string;
    SESSION_SECRET?: string;
  }
}
