/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path';
import * as webpack from 'webpack';
// const babelOptions = require('./babel.config');
const TsPlugin = require('fork-ts-checker-webpack-plugin');

export const MODE =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const ENABLE_TS_CHECK = !process.argv.includes('--disableTsCheck');
export const ENV_VAR_PREFIX = 'REACT__';

export const ENVIRONMENT_VARS = {
  NODE_ENV: MODE,
  /** Find all env vars prefixed with ENV_VAR_PREFIX */
  ...Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.startsWith(ENV_VAR_PREFIX),
    ),
  ),
};

console.dir({ MODE, ENVIRONMENT_VARS });

export const withDir = (dirname: string) => (...filePaths: string[]) =>
  path.resolve(dirname, ...filePaths);

export default ({ dir }: { dir: ReturnType<typeof withDir> }) => {
  /** @ts-check @type import('webpack').Configuration */
  return {
    mode: MODE,
    devtool: MODE === 'production' ? false : 'eval-cheap-module-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENVIRONMENT_VARS.NODE_ENV),
        'window.REACT_ENV': JSON.stringify(ENVIRONMENT_VARS),
      }),
      ...(ENABLE_TS_CHECK ? [new TsPlugin()] : []),
    ],
    module: {
      rules: [
        {
          // include: dir('./src'),
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
            // {
            //   loader: 'babel-loader',
            //   options: {
            //     plugins: [
            //       '@babel/plugin-syntax-typescript',
            //       '@babel/plugin-syntax-jsx',
            //       // ['@babel/plugin-syntax-decorators', { legacy: true }],
            //       // ['@babel/plugin-syntax-class-properties', { loose: true }],
            //       '@emotion/babel-plugin',
            //     ],
            //   },
            // },
          ],
        },
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf|webm)(\?.*)?$/,
          loader: 'file-loader',
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.tsx', '.ts', '.json'],
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
  };
};
