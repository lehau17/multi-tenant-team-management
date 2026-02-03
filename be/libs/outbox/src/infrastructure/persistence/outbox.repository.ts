import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { IOutboxRepository } from '../../domain/ports/outbox.port';
import { OutboxEntryData } from '../../domain/types/outbox-entry.types';

@Injectable()
export class OutboxRepository implements IOutboxRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save<TPayload, T>(
    entry: OutboxEntryData<TPayload>,
    entityClass: new () => T,
  ): Promise<T> {
    const repository = this.dataSource.getRepository(entityClass);
    const outboxEntry = repository.create({
      id: randomUUID(),
      aggregateType: entry.aggregateType,
      aggregateId: entry.aggregateId,
      eventType: entry.eventType,
      payload: entry.payload,
      createdAt: new Date(),
      processedAt: null,
      retryCount: 0,
      error: null,
    } as unknown as T);

    return repository.save(outboxEntry);
  }

  async saveMany<TPayload, T>(
    entries: OutboxEntryData<TPayload>[],
    entityClass: new () => T,
  ): Promise<T[]> {
    const repository = this.dataSource.getRepository(entityClass);
    const outboxEntries = entries.map((entry) =>
      repository.create({
        id: randomUUID(),
        aggregateType: entry.aggregateType,
        aggregateId: entry.aggregateId,
        eventType: entry.eventType,
        payload: entry.payload,
        createdAt: new Date(),
        processedAt: null,
        retryCount: 0,
        error: null,
      } as unknown as T),
    );

    return repository.save(outboxEntries);
  }
}
