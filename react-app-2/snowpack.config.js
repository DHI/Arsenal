// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type import("snowpack").SnowpackUserConfig */
module.exports = {
  mount: {
    src: { url: "/" },
  },
  plugins: [
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
  packageOptions: {},
  devOptions: {
    open: "none",
  },
  buildOptions: {
    out: "./build",
  },
};
