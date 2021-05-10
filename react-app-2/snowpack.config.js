// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type import("snowpack").SnowpackUserConfig */
module.exports = {
  plugins: [
    '@snowpack/plugin-babel',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-webpack',
  ],
  mount: {
    src: { url: '/dist' },
  },
  routes: [{ src: '/', dest: '/dist/index.html' }],
  optimize: {
    target: 'es2019',
  },
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
