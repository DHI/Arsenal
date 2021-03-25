// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type import("snowpack").SnowpackUserConfig */
module.exports = {
  mount: {
    src: { url: "/" },
  },
  plugins: [
    // ["@snowpack/plugin-webpack"], // Lets use snowpack's bundle till we need this...
    "@snowpack/plugin-postcss", // Depends on npm deps: postcss, postcss-cli, @snowpack/plugin-postcss
    "@snowpack/plugin-typescript", // Just does type checks
    "@snowpack/plugin-dotenv",
  ],
  optimize: {
    bundle: true,
    minify: false,
    target: "es2020",
  },
  routes: [],
  packageOptions: {},
  devOptions: {
    open: "none",
  },
  buildOptions: {
    out: "./build",
  },
};
