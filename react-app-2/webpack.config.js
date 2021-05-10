/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const TsPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const babelConfig = require('./babel.config');
const DotenvWebpack = require('dotenv-webpack');
const tsconfig = require('./tsconfig.json');
const dir = (...filePaths) => path.resolve(__dirname, ...filePaths);
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const IS_DEVELOPMENT = mode === 'development';
const IS_PRODUCTION = mode === 'production';
const IS_ANALYTICS = process.env.WEBPACK_ANALYZE === 'true';

const IS_REACT_REFRESH =
  mode === 'development' && !process.argv.includes('--disableReactRefresh');

console.dir({
  mode,
  IS_ANALYTICS,
  IS_REACT_REFRESH,
});

/** @ts-check @type import('webpack').Configuration */
module.exports = {
  mode,
  devtool: mode === 'production' ? false : 'eval-cheap-module-source-map',
  plugins: [
    new DotenvWebpack(),
    new HtmlPlugin({ template: dir('./src/index.html') }),
    ...(IS_REACT_REFRESH ? [new ReactRefreshWebpackPlugin({})] : []),
    ...(!IS_ANALYTICS ? [new TsPlugin()] : []),
    ...(IS_ANALYTICS
      ? [
          new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
            analyzerMode: 'server',
            analyzerPort: 9004,
          }),
        ]
      : []),
  ],
  module: {
    rules: [
      {
        include: dir('./src'),
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              ...babelConfig,
              plugins: [
                ...babelConfig.plugins,
                ...(IS_REACT_REFRESH ? ['react-refresh/babel'] : []),
              ],
            },
          },
          // {
          //   loader: 'esbuild-loader',
          //   options: {
          //     loader: 'tsx',
          //     target: 'es2018',
          //   },
          // },
        ],
      },
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
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  entry: {
    main: dir('./src/index.tsx'),
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.tsx', '.ts', '.json'],
    alias: {
      ...Object.fromEntries(
        Object.entries(
          tsconfig.compilerOptions.paths,
        ).map(([key, [firstPath]]) => [key, dir(firstPath)]),
      ),
    },
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
    path: dir('./build'),
  },
  target: 'web',
  stats: 'minimal',
  devServer: {
    hot: true,
    port: 9001,
  },
};
