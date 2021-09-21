module.exports = {
  ignorePatterns: ['node_modules', 'x'],
  extends: ['eslint-config-nfour/.eslintrc.react'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  rules: {},
};