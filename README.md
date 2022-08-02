# @dhi/arsenal.*

> A monorepo workspace for shared library development

+ [Overview](#overview)
+ [Requirements](#requirements)
+ [Usage](#usage)
+ [Package/Library versioning, changelogs, publishing](#packagelibrary-versioning-changelogs-publishing)
+ [Development in other projects](#development-in-other-projects)
+ [Deprecated functionality](#deprecated-functionality)
  
## Overview

Structure:
- `./apps`
  - Applications to demonstrate libraries within this repo
- `./libs`
  - NPM packages, published to Github Packages

Tooling:
- `pnpm` with workspaces
- `changesets` for npm package versioning, changelogs & publishing


## Requirements

- To access the NPM registry correctly, update your user ~/.npmrc with a GitHub Access Token. [See this for how to](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Usage

Project setup essentials:
```bash
git clone git@github.com:DHI/Arsenal.git && cd Arsenal

# Install deps & link everything up
pnpm i

# Build all libraries
pnpm build

```

Developing within the repo:
```bash
# Start developing a library
cd libs/jsonform && pnpm dev

# Start an app
cd apps/stories && pnpm start
## Library/Package versioning
```

## Package/Library versioning, changelogs, publishing

**Read this before doing any package versioning or publishing**:
- https://pnpm.io/using-changesets

> Note: All package should conform to this naming structure within NPM/package.json
> @dhi/arsenal.{name}

```bash
# Version libraries
# - Will walk through versioning choices and allow you to specify changed packages
pnpm release:version

# Publish libraries
# - Publishes packages which need to be published
# - Also updates all dependent packages with new version numbers
pnpm release:publish
```


## Development in other projects

By using `pnpm` we can leverage its `pnpm link --global` command to correctly link libraries from this monorepo into any other project.

```bash
pnpm setup # sets up PNPM to work globally

cd libs/scenarios
pnpm link --global # link the package into the global store
pnpm dev # start the development script to update build output on save
```

```bash

cd ~/Work/MyProject
pnpm link --global @dhi/arsenal.scenarios # link in the library we are working on
pnpm dev # start development server
```

Example workflow:
- Update source files in `libs/scenarios`
- Output files are update in `libs/scenarios/x`
- Dev server in `~/Work/MyProject` detects this change from ``~/Work/MyProject/node_modules/@dhi/arsenal.scenarios/x` and reloads the page/hot reloads

## Deprecated functionality

The `submodules/libs` `submodules/apps` directories were previously used to facilitate connected workspace automatic linking.

This practice has been abandoned due to `pnpm link` fitting that need, and it introduced issues with pnpm lockfiles becoming malformed.

The remaining functionality of submodules:
- When versioning & publishing a package, the version number of all dependent projects's package.json will get automatically bumped
- Packages will **not** be automatically linked, as that would require a shared pnpm-lock. You must still use `pnpm link --global`
  