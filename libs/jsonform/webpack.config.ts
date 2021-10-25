import Config, { withDir } from '../../webpack.config.base';
import { Configuration } from 'webpack';
import * as pkgJson from './package.json';

const DeclarationPlugin = require('npm-dts-webpack-plugin');
const dir = withDir(__dirname);
const base = Config({ dir, useReactShim: true });
const outdir = dir('./x');

export default {
  ...base,
  entry: { index: dir('./src/index.ts') },
  plugins: [
    ...base.plugins,

    new DeclarationPlugin({
      output: dir(outdir, 'index.d.ts'),
      logLevel: 'error',
    }),
  ],

  output: {
    ...base.output,
    library: {
      // name: 'JsonForm',

      type: 'commonjs-module',
    },
    path: outdir,
  },
  externals: [
    ...Object.keys(pkgJson.devDependencies),
    ...Object.keys(pkgJson.dependencies),
    ...Object.keys(pkgJson.peerDependencies),
  ],
} as Configuration;
