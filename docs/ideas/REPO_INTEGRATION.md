# Repo Integration Concept

This doc describes a concept to enhance transparency between multiple similar projects through the use of git submodules to create a single nested repo.

To help keep things in sync, a git-submodule repo can be created which allows dependencies from this repo to be injected into each project and run their respective build steps, showing any errors from the upgrade, and allowing for quick fixes to be migrated.

```
- projects
  - a
    - package.json
  - b
    - package.json
```