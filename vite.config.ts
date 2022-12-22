import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  base: '/ttetris/',
  publicDir: '../public',
  plugins: [react()],
  build: {
    // Specify the dist folder
    outDir: '../dist',
    emptyOutDir: true,
  },
});
