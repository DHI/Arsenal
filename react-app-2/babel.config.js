module.exports = {
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-syntax-typescript',
    ['@babel/plugin-syntax-decorators', { legacy: true }],
    ['@babel/plugin-syntax-class-properties', { loose: true }],
    'styled-components',
  ],
};
