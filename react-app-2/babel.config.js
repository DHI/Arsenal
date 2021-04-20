// @see https://github.com/ben-rogerson/twin.examples/blob/master/snowpack-react-emotion-typescript/babel.config.json
// NOTE: This is all to support these features:
// - twin.macro
// - emotion css <p css={css``} /> syntax
module.exports = {
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    'babel-plugin-twin',
    'babel-plugin-macros',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'styled-components',
  ],
};
