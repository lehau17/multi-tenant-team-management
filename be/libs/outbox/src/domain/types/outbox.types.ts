export enum OutboxStrategy {
  POLLING = 'polling',
  CDC = 'cdc',
}

export interface OutboxConfig {
  strategy: OutboxStrategy;
  pollingIntervalMs: number;
  maxRetryCount: number;
  batchSize: number;
}

export interface OutboxEntityRegistration<T = unknown> {
  entity: new () => T;
  topic: string;
  tableName: string;
}
