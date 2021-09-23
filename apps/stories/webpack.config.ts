/* eslint-disable @typescript-eslint/no-var-requires */
import Config, { withDir, MODE } from '../../webpack.config.base';
import { Configuration } from 'webpack';
const HtmlPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dir = withDir(__dirname);
const base = Config({ dir });

export default {
  ...base,
  plugins: [
    ...base.plugins,
    new HtmlPlugin({ template: dir('./src/__dev/index.html') }),
    ...(MODE === 'development'
      ? [
          new ReactRefreshWebpackPlugin({
            overlay: false,
          }),
        ]
      : []),
  ],
  entry: { index: dir('./src/__dev/index.tsx') },
  devServer: {
    // disableHostCheck: true,
    hot: true,
    port: 9001,
    host: '0.0.0.0',
    historyApiFallback: true,
    https: false,
  },
} as Configuration;
