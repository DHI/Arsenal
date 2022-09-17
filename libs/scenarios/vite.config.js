import { resolve } from 'path';
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import { buildPlugin } from 'vite-plugin-build';
export const makeConfig = ({ watch = false }) => defineConfig({
    root: resolve('./src'),
    plugins: [
        buildPlugin({
            fileBuild: {
                emitDeclaration: true,
                commonJsOutputDir: false,
                esOutputDir: resolve('./x'),
                ignoreInputs: ['**/*/vite.config*.ts'],
                ...(watch ? { watch: { include: ['**/*.ts', '**/*.tsx'] } } : {}),
            },
        }),
        reactPlugin({
            jsxImportSource: '@emotion/react',
        }),
    ],
});
export default makeConfig({ watch: false });
//# sourceMappingURL=vite.config.js.map