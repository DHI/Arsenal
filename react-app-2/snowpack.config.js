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
  ],
  packageOptions: {},
  devOptions: {
    open: "none",
  },
  buildOptions: {
    out: "./build",
  },
};
