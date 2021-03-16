# Conventions

## Directory Structure patterns

```
/project/
  /client/
    /__components
      - Contains generic react components or utility functions
    /__stories/
    /__tests/

  package.json
  tsconfig.json
  snowpack.config.json
  

```

## Data access & graphql client

- ...

## Graphql

- Client uses codegen library to generate a GQL client from schema
  - https://github.com/dotansimha/graphql-code-generator

## Module convention

- Eslint rules:
  - Exports defined at definition

- Links:
  - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md

## Pull request etiquete

- Needs a review for any merges
- Pipeline validates all lint, typescript, tests
  - Get pipeline working before actual review pls


## Feature flags

- Use .env files etc.
  - TODO
