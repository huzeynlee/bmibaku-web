import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // Recharts lives in the lazily loaded rate-history chart chunk (~170 kB gzip),
    // fetched only when history data exists. The main bundle stays small.
    chunkSizeWarningLimit: 650,
  },
});
