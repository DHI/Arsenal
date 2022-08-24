import { resolve } from 'path';
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    reactPlugin({
      jsxRuntime: 'automatic',
      jsxImportSource: '@emotion/react',
      include: ['**/*.tsx', '**/*.ts'],
    }),
  ],
  root: resolve('./src'),
  envDir: resolve('./.env'),
  envPrefix: 'REACT__',
  server: {
    host: '0.0.0.0',
    port: 9005,
    fs: { strict: true },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    outDir: resolve('./x'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      __css: resolve('./src/__css.ts'),
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
