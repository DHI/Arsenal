/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path';
import webpack from 'webpack';
// const babelOptions = require('./babel.config');
import TsPlugin from 'fork-ts-checker-webpack-plugin'
import { fileURLToPath } from 'url';

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

export const withDir = (dirname) => (...filePaths) =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ...filePaths);

export default ({
  dir,
  useReactShim = false,
}) => {
  /** @ts-check @type import('webpack').Configuration */
  return {
    mode: MODE,
    devtool: MODE === 'production' ? false : 'source-map',
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
                jsxFactory: 'jsx',
                jsxFragment: 'React.Fragment',
                ...(useReactShim
                  ? {
                      banner: `
                        import React from 'react';
                        import { jsx } from '@emotion/react/jsx-runtime';
                      `,
                    }
                  : {}),
              },
            },
            {
              loader: 'babel-loader',
              options: {
                presets: [],
                plugins: [
                  ['@babel/plugin-syntax-typescript', { isTSX: true }],
                  '@emotion',
                ],
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
