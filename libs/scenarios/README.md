# Scenarios

# Objectives

- Reusable between projects
- CRUD scenario operations
- Scenario config editor
- Scenario job event injesting
- Scenario UI components
  
# Usage

```ts
// - Create the state store
// - Wire it up to your own apps state
class MyAppState {
  scenarios = new ScenariosState<MyScenarioObject>({
    data: () => ({
      activeScenarioId: () => this.route.pathname?.scenarioId,
      setScenario: this.setScenario,
      activeSection: () => this.activeEditorSection,
      setSection: this.setEditorSection,
      createScenario: this.data.scenarioCreateQuery,
      deleteScenario: this.data.scenarioDeleteQuery,
      scenarioList: this.data.scenarioListQuery,
      updateScenario: this.data.scenarioUpdateQuery,
      executeJob: this.data.scenarioJobExecuteQuery,
      jobsList: this.data.scenarioJobListQuery,
      cancelJob: this.data.scenarioJobCancelQuery,
    }),
  })
}
```

```tsx
// - Provide the state store via React context
// - Utilize the components
<ScenariosStoreContext.Provider value={myAppState.scenarios}>
  <ScenariosPanels
    sections={{
      // - This adds an extra tab to the active scenario panel
      // - The `config` section is provided by default, but can be overriden
      results: MyOwnScenarioResultsSection,
    }}
  />
</ScenariosStoreContext.Provider>
```

## As seperate components

Feel free to use each component on its own

```ts
import {
  ScenarioPanels,
  ScenarioListPanel,
  ActiveScenarioPanel,
  SidebarPanel,
  ScenarioListItem,
  ScenarioConfigEditor,
} from '@dhi/arsenal.scenarios';
```
> Check the source code & Typescript types for details on how components are used.
