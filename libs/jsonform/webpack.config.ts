import Config, { withDir } from '../../webpack.config.base';
import { Configuration } from 'webpack';

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
  externals: ['react', 'react-dom'],
} as Configuration;
