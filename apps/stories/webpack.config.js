/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const TsPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dir = (...filePaths) => path.resolve(__dirname, ...filePaths);
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

/** @ts-check @type import('webpack').Configuration */
module.exports = {
  mode,
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlPlugin({ template: dir('./src/__dev/index.html') }),
    new TsPlugin(),
    ...(mode === 'development' ? [new ReactRefreshWebpackPlugin({})] : []),
  ],
  module: {
    rules: [
      {
        include: dir('./src'),
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2018',
            },
          },
        ],
      },
      {
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf|webm)(\?.*)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  entry: {
    main: dir('./src/__dev/index.tsx'),
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.tsx', '.ts', '.json'],
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    publicPath: '/',
    path: dir('./x'),
  },
  target: 'web',
  stats: 'minimal',
  cache: {
    type: 'filesystem',
  },
  devServer: {
    disableHostCheck: true,
    hot: true,
    port: 9001,
    host: '0.0.0.0',
    historyApiFallback: true,
    https: false,
  },
};
