import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.PROD': JSON.stringify(true), // Ensure PROD is injected
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
});
