/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const TsPlugin = require('fork-ts-checker-webpack-plugin');
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const ENABLE_TS_CHECK = !process.argv.includes('--disableTsCheck');
const ENV_VAR_PREFIX = 'REACT__';

const ENVIRONMENT_VARS = {
  NODE_ENV: mode,
  /** Find all env vars prefixed with ENV_VAR_PREFIX */
  ...Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.startsWith(ENV_VAR_PREFIX),
    ),
  ),
};

console.dir({ mode, ENVIRONMENT_VARS });

export const withDir = (dirname: string) => (...filePaths: string[]) =>
  path.resolve(dirname, ...filePaths);

export default ({ dir }: { dir: ReturnType<typeof withDir> }) => {
  /** @ts-check @type import('webpack').Configuration */
  return {
    mode,
    devtool: mode === 'production' ? false : 'eval-cheap-module-source-map',
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
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
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
  };
};
