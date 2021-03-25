# React app template 2021

+ [TODO](#todo)
+ [Conventions](#conventions)
  + [Directory structure](#directory-structure)
    + [Using "private" __ prefixes](#using-private-__-prefixes)

## TODO

- Configure emotioncss optimally
  - Should use a babel transform to make styled components work best.
- Graphql client:
  - Use graphql-codegen

## Conventions

### Directory structure

When developing a UI project, an intuitive pattern that typically emerges (eg. angularjs, vuejs) is where the markup, styling, state and assets are grouped together in the same folder.

Another way we see emerge is where a few top-level folders are created to contain a collection of *all* similar components

eg. 
- `components` for components with no global state
- `containers` for components with global state
- `state` for all global state
- `api` for all api
- ... etc.

The problem with this is not obvious when starting a new project. When you only have a few files, it all seems to work.

Once the project grows and you're looking at 40 files in each folder:
- It becomes more difficult when making discrete refactors
  - (Do I have to change ALL components now, or just this one?)
- Finding relevant files becomes a pecking exercise, scanning through each top-level folder
  
By adding another layer of convention we can try to have the best of both worlds.

#### Using "private" __ prefixes 

One can design their folder structure to incorporate a naming convention like so:

>  `__someFolder`
> `__someFile.tsx` 

In your editor you'll find these files stick to the top of a directory listing, as is typically alphabetically sorted. 

You can think of these as "private" folders or files, similar in function to a `class`'s private/protected fields.

This adds a second dimension to the directory structure, which aids in development by keeping code which is frequently written together, close in proximity.

This pattern is already prolific when it comes to testing, mocking etc. You may have already been introduced to: `__tests__`, `__mocks__` from `jest`

> Example project structure explained:

```ts
/project/
  - /tests/ // (Optional) Top-level integration tests
  - /stories/ // (Optional) Top-level integration Storybook stories
  - /src/
    - /__config/
      - env.d.ts // Global variables/env vars 
      - features.ts // Feature flags, to turn features on and off based on env vars.
                    // Exports constant booleans like IS_SOME_FEATURE_ENABLED
      - <name>.d.ts // Any other typings you gotta do
    - /__components/ // For GLOBAL components which are shared throughout the entire app
      - /anotherComponent/ // Example of a component with its own stories, tests etc.
        - __translations.tsx // Can be a folder or file, doesnt matter
        - anotherComponent.tsx
        - anotherComponent.stories.tsx
        - anotherComponent.test.tsx
        - someImage.png
      - colors.ts // Colors relevant to the entire app
      - theme.ts // Global theme
      - fancyTable.tsx // No global state, just takes props and returns JSX
    - /__translations/ // Global compositional root to merge all translations and then add to the global state.
                       // Also for global translations (which apply to any part of the app)
    - /someFeature/
      - __translations.tsx // Translations for `someFeature` go here
      - /__components/
        - someFeatureAvatar.tsx // No global state, just renders JSX from props
        - colors.ts // Exports some color variables relevant to `someFeature`
        - formatSomething.ts // Utility fn

      - someFeature.models.ts // Has global state 
      - someFeature.tsx // A controller, likely the "index" or "pageRoot"
      - someFeatureSectionGreen.tsx // Another controller, but for a subsection
      - someFeatureSectionBlue.tsx // Another controller, but for a subsection
    - routings.tsx // Compose routing in one place
    - store.ts // Compose the state/store in one place
    - index.tsx // Compose the entry point of the app here
  - package.json
  - tsconfig.json // Configured to import all *.d.ts inside src/__config
```

Each project should define its own conventions around which "private" folder/files it wants to make standard.
