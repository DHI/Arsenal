# React App (March 2021)

This template is built on top of these notable features:

- [x] React
- [x] State based routing
- [x] Mobx global state
- [x] Mobx local state
- [x] Styling:
  - [x] Styled Components
    - [x] In react classnames
    - [x] Styled components as css selectors (requires babel config)
    - [x] Migrate to twin? (https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion)
      - https://github.com/ben-rogerson/twin.examples/tree/master/snowpack-react-emotion-typescript
      - [x] Ensure it works same as emotion
  - [x] Tailwindcss
    - [x] In react classnames
    - [x] In styled components
      - (https://github.com/ben-rogerson/twin.macro)
      - Likely needs babel transpile
- [x] Snowpack for fast development experience
- [x] Webpack production build
- [x] Storybook stories
- [x] DeckGL map & layer state management
- [ ] Bundle splitting per page
  - [ ] TODO: Demonstrate use of `@loadable/component`

## Get started

```bash
yarn # install
yarn start # start dev server
yarn start-storybook # start storybook
yarn build # produce production build
```

Currently runs on either `webpack` or `snowpack`. 

Snowpack is tricky to configure due to its teething problems (its quite new), but offers a superior development experience.
The project should be compatible with either.

## Conventions

Your project might be different.

Document your conventions, whatever they may be.

## TODO:

-  [ ] Graphql client:
  - Use graphql-codegen
