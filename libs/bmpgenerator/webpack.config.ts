import Config, { withDir } from '../../webpack.config.base';
import { Configuration } from 'webpack';
import * as pkgJson from './package.json';

const DeclarationPlugin = require('npm-dts-webpack-plugin');
const dir = withDir(__dirname);
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
} as Configuration;

export default config;
