import { OutboxEntryData } from '../types/outbox-entry.types';

export const OUTBOX_REPOSITORY = Symbol('OUTBOX_REPOSITORY');

export interface IOutboxRepository {
  save<TPayload, T>(
    entry: OutboxEntryData<TPayload>,
    entityClass: new () => T,
  ): Promise<T>;

  saveMany<TPayload, T>(
    entries: OutboxEntryData<TPayload>[],
    entityClass: new () => T,
  ): Promise<T[]>;
}
