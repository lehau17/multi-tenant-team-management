import { OutboxEntryData } from '../types/outbox-entry.types';

export const OUTBOX_SERVICE = Symbol('OUTBOX_SERVICE');

export interface IOutboxPort {
  save<TPayload, T>(
    entry: OutboxEntryData<TPayload>,
    entityClass: new () => T,
  ): Promise<T>;

  saveMany<TPayload, T>(
    entries: OutboxEntryData<TPayload>[],
    entityClass: new () => T,
  ): Promise<T[]>;
}
