import Config, { withDir } from './webpack.config.base.mjs';
import  pkgJson from './package.json' assert {type: "json"};
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import DeclarationPlugin from 'npm-dts-webpack-plugin'

const dir = withDir(dirname(fileURLToPath(import.meta.url)));
const base = Config({ dir });
const entry = dir('./src/index.ts');
const outdir = dir('./x');

export const config = {
  ...base,
  plugins: [
    ...base.plugins,
    new DeclarationPlugin({
      output: dir(outdir, 'index.d.ts'),
      logLevel: 'error',
    }),
  ],
  entry: { index: entry },
  output: {
    ...base.output,
    library: {
      name: 'BmpGenerator',
      type: 'umd',
    },
    path: outdir,
  },
  externals: [
    ...Object.keys(pkgJson.devDependencies),
    ...Object.keys(pkgJson.dependencies),
    ...Object.keys(pkgJson.peerDependencies),
  ],
};

export default config;
