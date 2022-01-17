export enum ScenarioJobStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Error = 'Error',
}

export interface ScenarioJobInstance {
  id: string;
  status: ScenarioJobStatus;
  statusMessage?: string;
  started?: string;
  finished?: string;
  progress?: number;
  accountId?: string;
  parameters?: { ScenarioId?: string };
}

export interface ScenarioInstance<
  DATA extends ScenarioConfig = ScenarioConfig,
  JOB extends ScenarioJobInstance = ScenarioJobInstance,
> {
  id: string;
  data: DATA;
  job?: JOB;
  metadata?: { group: string };
}

export interface ScenarioConfig {
  Name: string;
  // CreatedAt: string;
  // UpdatedAt: string;
}

export enum ClassNames {
  ScenarioListPanel = 'scenario-list-panel',
  ActiveScenarioPanel = 'active-scenario-panel',
}
