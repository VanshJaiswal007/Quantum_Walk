import path from 'path';
import { fileURLToPath } from 'url';

export default {
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'client'),
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
  },
};
