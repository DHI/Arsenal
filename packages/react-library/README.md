# React Components Library

A minimal react library project for publishing components to share

![](dependencygraph.svg)

---

## Usage

Build then check that components are being exported correctly:
```
yarn build && yarn ts-node test/testBuiltComponentExports.ts

```

## NPM Release

The project builds to `./lib`.

```ts
// Example of extracting a single component
import { MyComponent } from '@dhi/webdev-arsenal/lib/MyComponent
```

# Development Workflow

- Run `yarn dev` to start storybook
- Wait for it to build
- Hit `F5` in VSCode to spawn the debug version of chrome
- Add breakpoints and see them met inside VSCode!