import * as HtmlPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import TsPlugin = require('fork-ts-checker-webpack-plugin');

/** Ensures exact types for the returned config! */
const dir = (...filePaths: string[]) => path.resolve(__dirname, ...filePaths);
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const disableTsCheck =
  process.argv.includes('--json') || process.argv.includes('--transpileOnly');

type Config = { devServer?: any } & webpack.Configuration;

/** This IIFE allows the config to be exactly typed */
export default (<Cfg extends Config>(c: Cfg) => c)({
  mode,
  devtool: mode === 'production' ? false : 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: mode }),
    new HtmlPlugin({
      filename: 'index.html',
      template: dir('./client/index.html'),
    }) as any,
    ...(disableTsCheck
      ? []
      : [
          new TsPlugin({
            formatter: 'codeframe',
            async: true,
            typescript: {
              memoryLimit: 4096,
              mode: 'write-tsbuildinfo',
              configOverwrite: {
                compilerOptions: { importsNotUsedAsValues: 'preserve' },
              },
            },
          }),
        ]),
  ],
  entry: {
    client: dir('./client/index.tsx'),
  },
  target: 'web',
  output: {
    publicPath: '/',
    path: dir('./build'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        include: dir('./client'),
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
      },
      {
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.json'],
    alias: {
      // Helps improve build sizes
      '@material-ui/core': '@material-ui/core/esm',
      '@material-ui/icons': '@material-ui/icons/esm',
    },
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'async',
        },
      },
    },
  },
});
