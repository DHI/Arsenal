// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type import("snowpack").SnowpackUserConfig */
module.exports = {
  mount: {
    src: { url: "/" },
  },
  plugins: [
    "@snowpack/plugin-babel",
    "@snowpack/plugin-postcss", // Depends on npm deps: postcss, postcss-cli, @snowpack/plugin-postcss
    "@snowpack/plugin-typescript", // Just does type checks
    "@snowpack/plugin-dotenv",
    ["@snowpack/plugin-webpack"],
  ],
  optimize: {
    target: "es2017",
    // bundle: true,
    // minify: false,
    // manifest: true,
  },
  routes: [],
  packageOptions: {
    polyfillNode: true,
    knownEntrypoints: [
      "@emotion/react",
      "@emotion/styled",
      "@emotion/styled/base",
    ],
  },
  devOptions: {
    open: "none",
    port: 9001,
  },
  buildOptions: {
    out: "./build/dist",

    clean: true,
  },
};
