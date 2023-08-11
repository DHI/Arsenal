import { observer, styled } from '@dhi/arsenal.ui';
import { useEffect, useMemo } from 'react';
import {
  ScenarioInstance,
  ScenariosPanels,
  ScenariosState,
  ScenariosStoreContext,
} from './';
import { makeAutoObservable, toJS } from 'mobx';
import { AsyncValue, Value } from '@dhi/arsenal.models';
import { $Row } from '@dhi/arsenal.ui/src/components';
import { exampleScenarioForm } from './__common/reference/exampleSchema';
import '@fontsource/roboto';

export default {
  title: 'Scenarios',
};

class DemoState {
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
      this.scenarioList.set([...this.scenarioList.value, scenario]),
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
    scenarioSchema: () => exampleScenarioForm,
    setScenario: (id) => this.activeScenario.set(id),
    setSection: (id) => this.activeSection.set(id),
  }));
}

export const ScenarioPanels = observer(() => {
  const s = useMemo(() => new DemoState(), []);

  return (
    <Container>
      <ScenariosStoreContext.Provider value={s.scenarios}>
        <ScenariosPanels />
        <pre>
          {JSON.stringify(toJS(s.scenarios.activeScenario?.data), null, 2)}
        </pre>
      </ScenariosStoreContext.Provider>
    </Container>
  );
});

export const ReadOnly = observer(() => {
  const s = useMemo(() => new DemoState(), []);

  useEffect(() => {
    s.scenarios.createScenario({
      id: 'foo',
      data: {
        name: 'New Scenario',
        outflowLocations: [
          {
            name: 'asdsa',
            longitude: 0,
            latitude: 0,
            dischargeRate: 0.1,
            effluentConcentration: {
              enterococci: 0,
              ammonia: 0,
              nitrates: 0,
              phosphate: 0,
              totalKjeldahlNitrogen: 0,
              nitrogen: 0,
              phosphorus: 0,
              totalSuspendedSolids: 0,
            },
          },
        ],
        selectedEvent: {
          eventName: 'Event 1',
        },
        modelName: 'Dummy_MVP',
      },
    });
  }, []);

  return (
    <Container>
      <ScenariosStoreContext.Provider value={s.scenarios}>
        <ScenariosPanels
          editor={{
            readOnly: true,
          }}
        />
        <pre>
          {JSON.stringify(toJS(s.scenarios.activeScenario?.data), null, 2)}
        </pre>
      </ScenariosStoreContext.Provider>
    </Container>
  );
});

const Container = styled($Row)`
  height: 100%;
  font-family: 'Roboto';
  align-items: stretch;
  && {
    align-items: stretch;

    .active-scenario-panel {
      min-width: 400px;
    }
  }
`;
