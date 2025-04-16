import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Provide empty fallback for process.env (to avoid errors if used in code)
    'process.env': {}
  },
  server: {
    port: 5173
  }
});
