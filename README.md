# @dhi/arsenal.*

## Docs

See [./.docs](./.docs)

## Project

- ./apps
  - Applications
- ./libs
  - NPM packages (Published to Github Packages)

## Usage

This project uses:
- `pnpm` with workspaces
- `changesets` for npm versioning
- Requires you configure your user ~/.npmrc with GitHub Access Token. [See this for details](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

```bash
# Clone repo

git clone git@github.com:DHI/Arsenal.git
cd Arsenal

# Install deps
pnpm i

# Start default app
pnpm start

# Build all packages & apps
pnpm build

# Development of libraries
# - Will recompile on changes
cd libs/jsonform && pnpm dev

# Start an app from the root directory
pnpm run start --filter ./apps/stories

# Version libraries
# - Will walk through versioning choices
pnpm release:version

# Publish libraries
# - Will publish & replace all workspace:* aliases 
pnpm release:publish
```

For package versioning please read this:
- https://pnpm.io/using-changesets

## Submodules

In order to link in in-development libraries we can make git submodules part of the pnpm workspace automatically.

To add a project:

```bash
cd submodules/apps
git clone <uri>

cd ../..
pnpm install
```

Then to develop within that project open a new workspace for it:

```
cd submodules/apps/MyProject
code .
```

All submodules/**/* projects are git ignored by this parent project.