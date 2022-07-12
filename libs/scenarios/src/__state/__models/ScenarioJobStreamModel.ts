import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { makeAutoObservable } from 'mobx';
import { ScenarioInstance } from '../..';
import { normalizeJobStatusData } from './normalizeJobStatusData';

export class ScenarioJobStreamModel<SCENARIO extends ScenarioInstance> {
  constructor() {
    makeAutoObservable(this);
  }

  connection!: HubConnection;

  onJobUpdated = (resolver: (job: NonNullable<SCENARIO['job']>) => void) =>
    this.connection.on('JobUpdated', (event: JobStateEvent) => {
      try {
        resolver(parseSignalrEventData(event.data));
      } catch {}
    });

  onJobAdded = (resolver: (job: NonNullable<SCENARIO['job']>) => void) =>
    this.connection.on('JobAdded', (event: JobStateEvent) => {
      try {
        resolver(parseSignalrEventData(event.data));
      } catch {}
    });

  onScenarioAdded = (resolver: (job: SCENARIO) => void) =>
    this.connection.on('JsonDocumentAdded', (event: JobStateEvent) => {
      try {
        resolver(parseSignalrEventData(event.data));
      } catch {}
    });

  onScenarioUpdated = (resolver: (job: SCENARIO) => void) =>
    this.connection.on('JsonDocumentUpdated', (event: JobStateEvent) => {
      try {
        resolver(parseSignalrEventData(event.data));
      } catch {}
    });

  invokeAddJobFilter = (filter: any) =>
    this.connection.invoke('AddJobFilter', 'Worker', filter);

  invokeAddJsonDocumentFilter = (filter: any) =>
    this.connection.invoke(
      'AddJsonDocumentFilter',
      'jsondocumentscenarios',
      filter,
    );

  connect = async ({
    accessToken,
    apiUrl,
  }: {
    accessToken: string;
    apiUrl: string;
  }) => {
    await this.disconnect();

    this.connection = new HubConnectionBuilder()
      .withUrl(apiUrl, {
        withCredentials: false,
        accessTokenFactory: () => accessToken,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  };

  start = async () => {
    await this.connection.start();
  };

  disconnect = async () => {
    await this.connection?.stop();
  };
}

interface JobStateEvent {
  id: string;
  userName: string;
  data: string;
}

function parseSignalrEventData<R = {}>(v: string): R {
  return normalizeJobStatusData(JSON.parse(v));
}
