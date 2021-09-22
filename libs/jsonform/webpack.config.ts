import Config, { withDir } from '../../webpack.config.base';

const dir = withDir(__dirname);
const baseConfig = Config({ dir });

/** @ts-check @type import('webpack').Configuration */
export default {
  ...baseConfig,
  entry: { index: dir('./src/index.ts') },
  output: {
    ...baseConfig.output,
    libraryTarget: 'commonjs2',
    // library: 'index',
    path: dir('./x'),
  },
};
