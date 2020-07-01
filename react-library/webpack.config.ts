import * as TypeCheck from 'fork-ts-checker-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import * as packageJson from './package.json';
import * as Copy from 'copy-webpack-plugin';

const dir = (...filePaths: string[]) => path.resolve(__dirname, ...filePaths);
const buildDir = dir(`./lib`)
const isProd = process.env.NODE_ENV === 'production';
const mode = isProd ? 'production' : 'development';

/** @reference https://webpack.js.org/configuration/ */
export default {
  mode,
  devtool: isProd ? false : 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.json'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  plugins: [
    new TypeCheck({ silent: process.argv.includes('--json') }),
    new webpack.EnvironmentPlugin({ NODE_ENV: mode }),
    ...(!isProd ? [new webpack.HotModuleReplacementPlugin()] : []),
    new Copy([
      {
        from: dir('./package.json'),
        to: buildDir,
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        include: dir('./components'),
      },
      {
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        loader: 'file-loader',
        include: dir('./components'),
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
        include: dir('./components'),
      },
    ],
  },
  entry: {
    /** `components` is used as [name] */
    components: dir('./components/index.tsx'),
  },
  target: 'web',
  output: {
    path: buildDir,
    libraryTarget: 'commonjs',
    /** @example Creates `./build/components.js` */
    filename: `[name].js`,
  },
  // These become runtime deps and will not be bundled.
  externals: Object.keys(packageJson.dependencies),
} as webpack.Configuration;
