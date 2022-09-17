import { resolve } from 'path';
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import { buildPlugin } from 'vite-plugin-build';

export default defineConfig({
  root: resolve('./src'),
  plugins: [
    buildPlugin({
      fileBuild: {
        emitDeclaration: true,
        commonJsOutputDir: false,
        esOutputDir: resolve('./x'),
        ignoreInputs: ['**/*/vite.config.ts'],
        watch: { include: ['**/*.ts', '**/*.tsx'] },
      },
    }),
    reactPlugin({
      jsxImportSource: '@emotion/react',
    }),
  ],
});
