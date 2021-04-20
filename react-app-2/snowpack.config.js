// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type import("snowpack").SnowpackUserConfig */
module.exports = {
  mount: {
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-babel',
    '@snowpack/plugin-postcss', // Depends on npm deps: postcss, postcss-cli, @snowpack/plugin-postcss
    '@snowpack/plugin-typescript', // Just does type checks
    '@snowpack/plugin-dotenv',
    ['@snowpack/plugin-webpack'],
  ],
  optimize: {
    target: 'es2019',

    // bundle: true,
    // minify: false,
    // manifest: true,
  },
  routes: [
    {
      src: '/',
      dest: '/dist/index.html',
    },
  ],
  packageOptions: {
    polyfillNode: true,

    knownEntrypoints: ['styled-components'],
  },
  devOptions: {
    open: 'none',
    port: 9001,
    output: 'stream',
  },
  buildOptions: {
    out: './build/dist',

    clean: true,
  },
};
