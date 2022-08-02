import { FormConfig } from '@dhi/arsenal.jsonform';
import { AsyncValue, StateModel } from '@dhi/arsenal.models';
import Fuse from 'fuse.js';
import { makeAutoObservable, toJS } from 'mobx';
import { v4 as uuid } from 'uuid';
import { createContextHook } from '@dhi/arsenal.ui/x/components';
import {
  ScenarioInstance,
  ScenarioJobInstance,
  ScenarioJobStatus,
} from '../types';
import { NoticesModel } from './__models/NoticesModel';
import { ScenarioJobStreamModel } from './__models/ScenarioJobStreamModel';
import { normalizeJobStatusData } from './__models/normalizeJobStatusData';

export class ScenariosState<
  SCENARIO extends ScenarioInstance = ScenarioInstance,
  CONFIG extends { NoticeKinds: {} } = { NoticeKinds: ScenarioNoticeKinds }
> {
  scenarioListSearchText = new StateModel<string | undefined>(undefined);
  draftScenario = new StateModel<undefined | SCENARIO>(undefined);
  activeWipScenario = new StateModel<undefined | SCENARIO>(undefined);
  notices = new NoticesModel<CONFIG['NoticeKinds']>();
  jobsListPollingInterval?: ReturnType<typeof setInterval> = undefined;
  jobsListPollingDelay?= 5000;
  jobStream?: ScenarioJobStreamModel<SCENARIO>

  constructor(
    private _config: () => {
      behaviour?: {
        canCreateScenarios?: boolean;
        canFilterScenarios?: boolean;
        canDeleteScenarios?: boolean;
        canEditScenarios?: boolean;
        canCloneScenarios?: boolean;
        jobStatus: {
          method: 'polling' | 'websockets' | 'disabled';
        };
      };
      /** Key within scenario.data for the scenario name  */
      scenarioDataNameKey: keyof SCENARIO['data'];
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
      jobStatusStreamUrl?: () => string;
      authToken: () => undefined | string;
    },
  ) {
    makeAutoObservable(this);
  }

  get config() {
    return this._config();
  }

  get activeScenarioName() {
    return this.activeScenario?.data[this.config.scenarioDataNameKey as any] as
      | string
      | undefined;
  }

  get activeWipScenarioName() {
    return this.activeWipScenario.value?.data?.[
      this.config.scenarioDataNameKey as any
    ] as string | undefined;
  }

  get scenarioSchema() {
    return this.config.scenarioSchema();
  }

  get scenarios() {
    return this.config.scenarioList.value?.map((s) => ({
      ...s,
      job: this.config.jobsList?.value?.find(
        (j) => j.parameters?.ScenarioId === s.id,
      ),
    }));
  }

  get activeScenarioId() {
    return this.config.activeScenarioId();
  }

  get activeSection() {
    return this.config.activeSection();
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
        status.toUpperCase() as any,
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
      this.config.createScenario.isPending ||
      this.config.updateScenario.isPending
    );
  }

  get isActiveScenarioADraft() {
    if (!this.activeScenario?.id) return false
    
    return this.activeScenario?.id === this.draftScenario.value?.id;
  }

  get activeScenarioIsComplete() {
    return (
      this.activeScenario?.job?.status.toUpperCase() ===
      ScenarioJobStatus.Completed
    );
  }

  setScenario = (id: this['activeScenarioId']) => this.config.setScenario(id);

  setSection = (section: this['activeSection']) =>
    this.config.setSection(section);

  startDraftScenario = () => {
    if (this.draftScenario.value?.id) return;

    this.setScenario(undefined);

    this.draftScenario.set({
      id: uuid(),
      data: {
        ...this.config.defaultScenarioData(),
        [this.config.scenarioDataNameKey]: 'New Scenario',
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

    await this.config.createScenario.query({
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

    await this.config.scenarioList.query();

    this.setScenario(scenario.id);
  };

  updateScenario = async <S extends SCENARIO>(scenario: S) => {
    await this.config.updateScenario.query({
      scenario: {
        ...scenario,
        data: {
          ...scenario.data,
          UpdatedAt: new Date().toISOString(),
        },
      },
    });

    this.resetActiveScenarioState();

    await this.config.scenarioList.query();

    this.setScenario(scenario.id);
  };

  deleteScenario = async (scenarioId: string) => {
    await this.config.deleteScenario.query({ scenarioId });

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
    await this.config.cancelJob?.query({ jobId });
  };

  runScenarioJob = async (scenarioId: string) => {
    await this.config.executeJob?.query({ scenarioId });
    await new Promise((resolve) => setTimeout(resolve, 250));
    await this.fetchJobsList();
  };

  fetchJobsList = async () => {
    const { value } = (await this.config.jobsList?.query()) ?? {};

    if (value) this.config.jobsList?.set(value.map(normalizeJobStatusData));
  };

  fetchScenarioList = async () => {
    await this.config.scenarioList.reset().query();
  };

  listenForJobUpdates = async () => {
    switch (this.config.behaviour?.jobStatus?.method) {
      case 'polling':
        return this.startPollingJobsList();

      case 'websockets': {
        try {
          const stream = await this.consumeJobStream();

          this.emitNotificationsForJobStream(stream);
        } catch (e: any) {
          console.log(e);
        }
      }

      default: {
        // ..
      }
    }
  };

  startPollingJobsList = () => {
    this.stopPollingJobsList();

    if (this.config.behaviour?.jobStatus?.method !== 'polling') return;

    this.jobsListPollingInterval = setInterval(
      () => this.fetchJobsList(),
      this.jobsListPollingDelay,
    );
  };

  stopPollingJobsList = () => {
    clearInterval(this.jobsListPollingInterval!);
  };

  emitNotificationsForJobStream = async (
    stream?: ScenarioJobStreamModel<SCENARIO>,
  ) => {
    if (!stream) return;

    stream.onJobAdded((job) => {
      this.notices.add({
        content: {
          kind: 'jobAdded',
          job,
        },
        timeout: 5000,
      });
    });

    stream.onJobUpdated((job) => {
      if (job.status.toUpperCase() === ScenarioJobStatus.InProgress) return;
      if (job.status.toUpperCase() === ScenarioJobStatus.Pending) return;

      this.notices.add({
        content: {
          kind: 'jobUpdated',
          job,
        },
        timeout: 5000,
      });
    });

    stream.onScenarioAdded((scenario) => {
      this.notices.add({
        content: {
          kind: 'scenarioAdded',
          scenario,
        },
        timeout: 5000,
      });
    });
  };

  setJobInScenarioList = (updatedJob: SCENARIO['job']) => {
    if (!updatedJob || !this.config.jobsList) return;

    const existingIndex = this.config.jobsList?.value?.findIndex(
      (j) => j.parameters?.ScenarioId === updatedJob.parameters?.ScenarioId,
    );

    // TODO: seems to causing unecessary refreshes in results reactions

    if (existingIndex != null)
      this.config.jobsList.set(
        this.config.jobsList.value!.map((j) => {
          if (j.parameters?.ScenarioId === updatedJob.parameters?.ScenarioId)
            return updatedJob!;

          return j;
        }),
      );
    else
      this.config.jobsList.set([
        ...(this.config.jobsList.value ?? []),
        updatedJob!,
      ]);
  };

  setInScenarioList = (scenario: SCENARIO) => {
    const existingIndex = this.config.scenarioList.value?.findIndex(
      (s) => s.id === scenario.id,
    );

    if (existingIndex != null && existingIndex !== -1) {
      const prevScenario = this.config.scenarioList.value![existingIndex];

      this.config.scenarioList.value?.splice(existingIndex, 1, {
        ...prevScenario,
        ...scenario,
      });
    } else {
      this.config.scenarioList.value?.push(scenario);
    }
  };

  consumeJobStream = async () => {
    if (this.config.behaviour?.jobStatus?.method !== 'websockets') return;
    
    const apiUrl = this.config.jobStatusStreamUrl?.();
    const accessToken = this.config.authToken();

    if (!apiUrl) throw new Error('Missing job stream api url');
    if (!apiUrl) throw new Error('Missing job stream api url');
    if (!accessToken) throw new Error('Not authorized yet');

    const stream = new ScenarioJobStreamModel<SCENARIO>();

    this.jobStream = stream

    await stream.connect({ accessToken, apiUrl });

    stream.onJobAdded((job) => {
      this.setJobInScenarioList(job);
    });

    stream.onJobUpdated((job) => {
      this.setJobInScenarioList(job);
    });

    stream.onScenarioAdded((scenario) => {
      this.setInScenarioList(scenario);
    });

    stream.onScenarioUpdated((scenario) => {
      this.setInScenarioList(scenario);
    });

    await stream.start();

    stream.invokeAddJobFilter([]);
    stream.invokeAddJsonDocumentFilter([]);

    return stream;
  };
}

const { Context: ScenariosStoreContext, use: useScenariosStore } =
  createContextHook<ScenariosState>();

export { ScenariosStoreContext, useScenariosStore };

export type ScenarioNoticeKinds =
  | {
      job: ScenarioJobInstance;
      kind: 'jobAdded';
    }
  | {
      job: ScenarioJobInstance;
      kind: 'jobUpdated';
    }
  | {
      scenario: ScenarioInstance;
      kind: 'scenarioAdded';
    };
