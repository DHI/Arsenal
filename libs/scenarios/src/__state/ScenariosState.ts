import { FormConfig } from '@dhi/arsenal.jsonform';
import { AsyncValue, StateModel } from '@dhi/arsenal.models';
import Fuse from 'fuse.js';
import { makeAutoObservable, toJS } from 'mobx';
import { v4 as uuid } from 'uuid';
import { createContextHook } from '@dhi/arsenal.ui/x/components';
import { ScenarioInstance, ScenarioJobStatus } from '../types';

export class ScenariosState<
  SCENARIO extends ScenarioInstance = ScenarioInstance,
> {
  scenarioListSearchText = new StateModel<string | undefined>(undefined);
  draftScenario = new StateModel<undefined | SCENARIO>(undefined);
  activeWipScenario = new StateModel<undefined | SCENARIO>(undefined);

  constructor(
    public config: {
      behaviour?: {
        canCreateScenarios?: boolean;
        canFilterScenarios?: boolean;
        canDeleteScenarios?: boolean;
        canEditScenarios?: boolean;
        canCloneScenarios?: boolean;
      };
      data(): {
        /** Key within scenario.data for the scenario name  */
        scenearioDataNameKey: keyof SCENARIO['data'];
        /** Defines the structure of the scenario data when a new scenario is initiated */
        defaultScenarioData: () => undefined | Partial<SCENARIO['data']>;
        scenarioSchema: () => FormConfig;
        activeScenarioId(): undefined | string;
        setScenario(id: undefined | string): void;
        activeSection(): undefined | string;
        setSection(section: undefined | string): void;
        scenarioList: AsyncValue<undefined | SCENARIO[], any>;
        createScenario: AsyncValue<any, { scenario: SCENARIO }>;
        updateScenario: AsyncValue<any, { scenario: SCENARIO }>;
        deleteScenario: AsyncValue<any, { scenarioId: string }>;
        jobsList?: AsyncValue<undefined | NonNullable<SCENARIO['job']>[]>;
        executeJob?: AsyncValue<any, { scenarioId: string }>;
        cancelJob?: AsyncValue<any, { jobId: string }>;
      };
    },
  ) {
    makeAutoObservable(this);
  }

  get data() {
    return this.config.data();
  }

  get activeScenarioName() {
    return this.activeScenario?.data[this.data.scenearioDataNameKey as any] as
      | string
      | undefined;
  }

  get activeWipScenarioName() {
    return this.activeWipScenario.value?.data?.[
      this.data.scenearioDataNameKey as any
    ] as string | undefined;
  }

  get scenarioSchema() {
    return this.data.scenarioSchema();
  }

  get scenarios() {
    return this.data.scenarioList.value?.map((s) => ({
      ...s,
      job: this.data.jobsList?.value?.find(
        (j) => j.parameters?.ScenarioId === s.id,
      ),
    }));
  }

  get activeScenarioId() {
    return this.data.activeScenarioId();
  }

  get activeSection() {
    return this.data.activeSection();
  }

  get activeScenario() {
    if (this.activeScenarioId === this.draftScenario.value?.id)
      return this.draftScenario.value;

    return this.scenarios?.find(
      (scenario) => scenario.id === this.activeScenarioId,
    );
  }

  get isActiveScenarioJobInProgress() {
    const status = this.activeScenario?.job?.status;

    if (status)
      return [ScenarioJobStatus.InProgress, ScenarioJobStatus.Pending].includes(
        status,
      );
  }

  get scenarioListSearch() {
    return new Fuse(this.scenarios ?? [], {
      keys: ['Data.Name'],
      isCaseSensitive: false,
      shouldSort: true,
      findAllMatches: true,
    });
  }

  get searchFilteredScenarioList() {
    if (!this.scenarioListSearchText.value)
      return (
        this.scenarios?.map(
          (s) => ({ item: s } as Fuse.FuseResult<typeof s>),
        ) ?? []
      );

    return this.scenarioListSearch.search(this.scenarioListSearchText.value);
  }

  get isPendingCriticalOperation() {
    return (
      this.data.createScenario.isPending || this.data.updateScenario.isPending
    );
  }

  get isActiveScenarioADraft() {
    return this.activeScenario?.id === this.draftScenario.value?.id;
  }

  get activeScenarioIsComplete() {
    return this.activeScenario?.job?.status === ScenarioJobStatus.Completed;
  }

  setScenario = (id: this['activeScenarioId']) => this.data.setScenario(id);

  setSection = (section: this['activeSection']) =>
    this.data.setSection(section);

  startDraftScenario = () => {
    if (this.draftScenario.value?.id) return;

    this.setScenario(undefined);

    this.draftScenario.set({
      id: uuid(),
      data: {
        ...this.data.defaultScenarioData(),
        [this.data.scenearioDataNameKey]: 'New Scenario',
      },
    } as SCENARIO);

    this.setScenario(this.draftScenario.value?.id);
  };

  resetDraftScenario = () => {
    this.draftScenario.set(undefined);
    this.activeWipScenario.set(undefined);
  };

  resetActiveScenarioState = () => {
    if (this.isActiveScenarioADraft) this.resetDraftScenario();

    this.setScenario(undefined);
    this.activeWipScenario.set(undefined);
  };

  createScenario = async <S extends SCENARIO>(scenario: S) => {
    const now = new Date();

    await this.data.createScenario.query({
      scenario: {
        ...scenario,
        data: {
          ...scenario.data,
          // CreatedAt: now,
          // UpdatedAt: now,
        },
      },
    });

    this.resetActiveScenarioState();

    await this.data.scenarioList.query();

    this.setScenario(scenario.id);
  };

  updateScenario = async <S extends SCENARIO>(scenario: S) => {
    await this.data.updateScenario.query({
      scenario: {
        ...scenario,
        data: {
          ...scenario.data,
          UpdatedAt: new Date().toISOString(),
        },
      },
    });

    this.resetActiveScenarioState();

    await this.data.scenarioList.query();

    this.setScenario(scenario.id);
  };

  deleteScenario = async (scenarioId: string) => {
    await this.data.deleteScenario.query({ scenarioId });

    await this.fetchScenarioList();
    await this.fetchJobsList();
  };

  cloneScenario = async <S extends SCENARIO>(scenario: S) => {
    this.resetActiveScenarioState();

    this.draftScenario.set({
      ...toJS(scenario),
      job: undefined,
      id: uuid(),
      data: { ...scenario.data, Name: `${scenario.data.Name} CLONE` },
    });

    this.setScenario(this.draftScenario.value!.id);
  };

  cancelJob = async (jobId: string) => {
    await this.data.cancelJob?.query({ jobId });
  };

  runScenarioJob = async (scenarioId: string) => {
    await this.data.executeJob?.query({ scenarioId });
    await new Promise((resolve) => setTimeout(resolve, 250));
    await this.fetchJobsList();
  };

  fetchJobsList = async () => {
    await this.data.jobsList?.query();
  };

  fetchScenarioList = async () => {
    await this.data.scenarioList.query();
  };

  jobsListPollingInterval?: ReturnType<typeof setInterval> = undefined;
  jobsListPollingDelay? = 5000;

  startPollingJobsList = () => {
    this.stopPollingJobsList();

    this.jobsListPollingInterval = setInterval(
      () => this.fetchJobsList(),
      this.jobsListPollingDelay,
    );
  };

  stopPollingJobsList = () => {
    clearInterval(this.jobsListPollingInterval!);
  };
}

const { Context: ScenariosStoreContext, use: useScenariosStore } =
  createContextHook<ScenariosState<ScenarioInstance>>();

export { ScenariosStoreContext, useScenariosStore };
