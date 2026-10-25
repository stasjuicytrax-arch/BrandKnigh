import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// base: адрес GitHub Pages. Если подключат brandknight.ru — base: '/' и public/CNAME.
export default defineConfig({
  base: '/BrandKnigh/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        policy: fileURLToPath(new URL('./policy/index.html', import.meta.url)),
        dev: fileURLToPath(new URL('./dev/index.html', import.meta.url)),
      },
      output: {
        manualChunks: (id) => {
          if (/node_modules[\/](three|@react-three|three-stdlib|troika|@monogrid|camera-controls|maath|meshline)/.test(id)) return 'three';
        },
      },
    },
  },
});
