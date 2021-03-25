const snowpackConfig = require('../snowpack.config')
const webpack = require('webpack')

module.exports = {
  webpackFinal: async (config) => {
    // Assign aliases from snowpack.config.js
    config.resolve.alias = {
      ...config.resolve.alias,
      ...snowpackConfig.alias,
    }
    // Add rules for supporting import.meta
    config.module.rules.push({
      test: /\.[tj]sx?$/,
      loader: [
        require.resolve('@open-wc/webpack-import-meta-loader'),
        require.resolve(
          '@snowpack/plugin-webpack/plugins/proxy-import-resolve'
        ),
      ],
    })
    // Add __SNOWPACK_ENV__ global
    config.plugins.push(
      new webpack.DefinePlugin({
        __SNOWPACK_ENV__: JSON.stringify(process.env),
      })
    )
    return config
  },
}