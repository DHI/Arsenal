module.exports = {
  ignorePatterns: ['node_modules', 'build'],
  extends: ['eslint-config-nfour/.eslintrc.react'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  rules: {},
};