/** @ts-check @type import('eslint-config-standard-typescript-prettier/types').TsEslintConfig */
module.exports = {
  plugins: ['only-warn', 'react', 'react-hooks'],
  extends: [
    'standard-typescript-prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'camelcase': ['off'],
    '@typescript-eslint/camelcase': ['off'],
    'newline-before-return': ['error'],
    'no-use-before-define': ['off'],
    'newline-after-var': ['error'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'multiline-expression' },
      { blankLine: 'always', prev: 'multiline-expression', next: '*' },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: '*', next: 'if' },
      {
        blankLine: 'never',
        prev: ['singleline-const'],
        next: ['singleline-const'],
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/ban-types': ['off'],
    'react-hooks/exhaustive-deps': ['off'],
    'react/prop-types': ['off'],
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: { react: { version: 'detect' } },
};
