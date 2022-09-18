import { css, observer } from '@dhi/arsenal.ui';
import { useMemo } from 'react';
import {
  ScenarioInstance,
  ScenariosPanels,
  ScenariosState,
  ScenariosStoreContext,
} from '@dhi/arsenal.scenarios';
import { makeAutoObservable } from 'mobx';
import { AsyncValue, Value } from '@dhi/arsenal.models';
import { reditScenarioForm } from '../jsonForm/schema';
import { $Row } from '@dhi/arsenal.ui/src/components';

export default {
  title: 'Scenarios',
};

export const ScenarioPanels = observer(() => {
  const { scenarios, scenarioList } = useMemo(
    () =>
      new (class {
        constructor() {
          makeAutoObservable(this);
        }

        activeScenario = new Value<string | undefined>(undefined);
        activeSection = new Value<string | undefined>(undefined);
        scenarioList = new Value<ScenarioInstance[]>([]);

        scenarios = new ScenariosState<ScenarioInstance>(() => ({
          activeScenarioId: () => this.activeScenario.value,
          activeSection: () => this.activeSection.value,
          authToken: () => 'token',
          defaultScenarioData: () => ({
            name: 'foo',
            outflowLocations: [],
            selectedEvent: {},
          }),
          createScenario: new AsyncValue(async ({ scenario }) =>
            scenarioList.set([...this.scenarioList.value, scenario]),
          ),
          deleteScenario: new AsyncValue(async () =>
            this.scenarioList.set(
              this.scenarioList.value.filter(
                (s) => s.id !== this.activeScenario.value,
              ),
            ),
          ),
          scenarioList: new AsyncValue(async () => this.scenarioList.value),
          updateScenario: new AsyncValue(async ({ scenario }) => {
            this.scenarioList.set([
              ...this.scenarioList.value.filter((s) => s.id !== scenario.id),
              scenario,
            ]);
          }),
          scenarioDataNameKey: 'name',
          scenarioSchema: () => reditScenarioForm,
          setScenario: (id) => this.activeScenario.set(id),
          setSection: (id) => this.activeSection.set(id),
        }));
      })(),
    [],
  );

  return (
    <$Row
      css={css`
        height: 100%;
        && {
          align-items: stretch;

          .active-scenario-panel {
            min-width: 400px;
          }
        }
      `}
    >
      <ScenariosStoreContext.Provider value={scenarios}>
        <ScenariosPanels />
      </ScenariosStoreContext.Provider>
    </$Row>
  );
});
