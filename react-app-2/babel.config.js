// @see https://github.com/ben-rogerson/twin.examples/blob/master/snowpack-react-emotion-typescript/babel.config.json
// NOTE: This is all to support these features:
// - twin.macro
// - emotion css <p css={css``} /> syntax
// - emotion css styled components full features
module.exports = {
  presets: [
    [
      "@babel/preset-react",
      { runtime: "automatic", importSource: "@emotion/react" },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    "babel-plugin-macros",
    [
      "@emotion/babel-plugin-jsx-pragmatic",
      { export: "jsx", import: "__cssprop", module: "@emotion/react" },
    ],
    [
      "@babel/plugin-transform-react-jsx",
      { pragma: "__cssprop", pragmaFrag: "React.Fragment" },
    ],
  ],
};
