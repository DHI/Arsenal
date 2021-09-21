# @dhi/arsenal.*

## Docs

See [./.docs](./.docs)

## Usage

This project uses:
- `pnpm` with workspaces
- `changesets` for npm versioning
- Requires you configure your .npmrc with GitHub Access Token. [See this for details](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

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
pnpm dev:libs

# Start an app from the root directory
pnpm run start --filter ./apps/stories

# Version libraries
# - Will walk through versioning choices
pnpm release:version

# Publish libraries
# - Will publish & replace all workspace:* aliases 
pnpm release:publish

# Clean up cache & build files
pnpm clean
```

For package versioning please read this:
- https://pnpm.io/using-changesets