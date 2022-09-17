import { resolve } from 'path';
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [reactPlugin({ jsxImportSource: '@emotion/react' })],
  root: resolve('./src'),
  server: {
    host: '0.0.0.0',
    port: 9005,
  },
  build: {
    outDir: resolve('./x'),
    emptyOutDir: true,
  },
  esbuild: { logOverride: { 'this-is-undefined-in-esm': 'silent' } },
});
