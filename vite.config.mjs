import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ 
  base: '/pr1v.app/',
  plugins: [react()],
  define: {
    'process.env': {}
  },
   server: {
    port: 5173,
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval';"
    }
  }
});