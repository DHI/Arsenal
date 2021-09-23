import Config, { withDir } from '../../webpack.config.base';
import { Configuration } from 'webpack';
import * as pkgJson from './package.json';

const dir = withDir(__dirname);
const base = Config({ dir });

export default {
  ...base,
  entry: { index: dir('./src/index.ts') },
  output: {
    ...base.output,
    libraryTarget: 'commonjs2',
    // library: 'index',
    path: dir('./x'),
  },
  externals: [
    ...Object.keys(pkgJson.dependencies),
    ...Object.keys(pkgJson.peerDependencies),
  ],
} as Configuration;
