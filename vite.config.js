import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', 
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html',
    },
    base: '/wp-content/reactpress/apps/personalizarcartera/', // Asegúrate de que este es el path correcto
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
