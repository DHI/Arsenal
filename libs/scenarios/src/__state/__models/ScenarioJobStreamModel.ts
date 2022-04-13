import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import camelCase from 'lodash-es/camelCase';
import { makeAutoObservable } from 'mobx';
import { ScenarioInstance } from '../..';

export class ScenarioJobStreamModel<SCENARIO extends ScenarioInstance> {
  constructor() {
    makeAutoObservable(this);
  }

  connection!: HubConnection;

  onJobUpdated = (resolver: (job: NonNullable<SCENARIO['job']>) => void) =>
    this.connection.on('JobUpdated', (event: JobStateEvent) => {
      try {
        resolver(parseEventData(event.data));
      } catch {}
    });

  onJobAdded = (resolver: (job: NonNullable<SCENARIO['job']>) => void) =>
    this.connection.on('JobAdded', (event: JobStateEvent) => {
      try {
        resolver(parseEventData(event.data));
      } catch {}
    });

  onScenarioAdded = (resolver: (job: SCENARIO) => void) =>
    this.connection.on('JsonDocumentAdded', (event: JobStateEvent) => {
      try {
        resolver(parseEventData(event.data));
      } catch {}
    });

  onScenarioUpdated = (resolver: (job: SCENARIO) => void) =>
    this.connection.on('JsonDocumentUpdated', (event: JobStateEvent) => {
      try {
        resolver(parseEventData(event.data));
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

function parseEventData<R = {}>(v: string): R {
  return keysToCamelCase(JSON.parse(v)) as any;
}

export function keysToCamelCase(obj: {}) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [camelCase(k), v]),
  );
}
