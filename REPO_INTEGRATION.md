# Repo Integration concept

To help keep things in sync, a git-submodule repo can be created which allows dependencies from this repo to be injected into each project and run their respective build steps, showing any errors from the upgrade, and allowing for quick fixes to be migrated.

```
- projects
  - a
    - package.json
  - b
    - package.json
```