/* eslint-disable @typescript-eslint/no-var-requires */
import Config, { withDir, MODE } from './webpack.config.base.mjs';
import HtmlPlugin from 'html-webpack-plugin'
import DeclarationPlugin from 'npm-dts-webpack-plugin'
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const dir = withDir(dirname(fileURLToPath(import.meta.url)));
const base = Config({ dir });

export default {
  ...base,
  plugins: [
    ...base.plugins,
    new HtmlPlugin({ template: dir('./src/__dev/index.html') }),
   
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
};
