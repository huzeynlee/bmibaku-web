/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOAN_APPLICATION_API_URL?: string;
  readonly VITE_RATES_API_URL?: string;
  readonly VITE_RATES_HISTORY_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
