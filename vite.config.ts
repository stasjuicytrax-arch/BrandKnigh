import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// base: адрес GitHub Pages. Если подключат brandknight.ru — base: '/' и public/CNAME.
export default defineConfig({
  base: '/',
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
        // three грузится отдельным чанком после первого кадра (TZ.md §6). Остальные зависимости — в vendor,
        // иначе Rollup кладёт общие хелперы (и React) в three, и тот попадает в начальную загрузку.
        manualChunks: (id) => {
          if (id.includes('vite/preload-helper') || id.includes('modulepreload-polyfill')) return 'vendor';
          if (!id.includes('node_modules')) return;
          if (/node_modules[\/](three|@react-three|three-stdlib|troika[^\/]*|@monogrid|camera-controls|maath|meshline|zustand|its-fine|suspend-react|react-reconciler|@use-gesture|hls\.js|stats|detect-gpu|tunnel-rat|potpack|@mediapipe)[\/]/.test(id)) return 'three';
          return 'vendor';
        },
      },
    },
  },
});
