export enum ScenarioJobStatus {
  Pending = 'PENDING',
  InProgress = 'INPROGRESS',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Cancelling = 'CANCELLING',
  Error = 'ERROR',
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
  DATA = Record<string, any>,
  JOB extends ScenarioJobInstance = ScenarioJobInstance,
> {
  id: string;
  data: DATA;
  job?: JOB;
  metadata?: { group: string };
}

export enum ScenarioClasses {
  ScenarioListPanel = 'scenario-list-panel',
  ActiveScenarioPanel = 'active-scenario-panel',
}
