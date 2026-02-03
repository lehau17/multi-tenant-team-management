import { IMessageQueuePort } from '@app/message-queue';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseOutboxEntity } from '../../domain/entity/base-outbox.entity';
import { IOutboxStrategyPort } from '../../domain/ports/outbox-strategy.port';
import { OutboxMessage } from '../../domain/types/outbox-entry.types';
import {
  DebeziumOutboxEvent,
  OutboxConfig,
  OutboxEntityRegistration,
} from '../../domain/types/outbox.types';
import { OutboxEntityRegistry } from '../registry/outbox-entity.registry';

@Injectable()
export class DebeziumOutboxStrategy implements IOutboxStrategyPort {
  private readonly logger = new Logger(DebeziumOutboxStrategy.name);
  private isRunning = false;
  private config: OutboxConfig | null = null;
  private messageQueue: IMessageQueuePort | null = null;

  constructor(
    private readonly dataSource: DataSource,
    private readonly registry: OutboxEntityRegistry,
  ) {}

  initialize(config: OutboxConfig, messageQueue: IMessageQueuePort): void {
    this.config = config;
    this.messageQueue = messageQueue;
  }

  register<T>(registration: OutboxEntityRegistration<T>): void {
    this.registry.register(registration);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.logger.log('Starting Debezium CDC outbox processor');

    const registrations = this.registry.getAll();
    if (registrations.length === 0) {
      this.logger.warn('No outbox entities registered');
      return;
    }

    await this.subscribeToDebeziumTopics();
    this.isRunning = true;

    this.logger.log('Debezium CDC outbox processor started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    const registrations = this.registry.getAll();
    for (const registration of registrations) {
      const debeziumTopic = this.getDebeziumTopic(registration);
      await this.messageQueue.unsubscribe(debeziumTopic);
    }

    this.isRunning = false;
    this.logger.log('Debezium CDC outbox processor stopped');
  }

  private async subscribeToDebeziumTopics(): Promise<void> {
    const registrations = this.registry.getAll();

    for (const registration of registrations) {
      const debeziumTopic = this.getDebeziumTopic(registration);

      await this.messageQueue.subscribe<DebeziumOutboxEvent>(
        debeziumTopic,
        async (envelope) => {
          await this.handleDebeziumEvent(registration, envelope.data);
        },
      );

      this.logger.log(`Subscribed to Debezium topic: ${debeziumTopic}`);
    }
  }

  private getDebeziumTopic(registration: OutboxEntityRegistration): string {
    // Debezium topic format: {serverName}.{schemaName}.{tableName}
    // Example: dbserver1.public.user_outbox
    return `${this.config.debeziumServerName}.${this.config.debeziumSchemaName}.${registration.tableName}`;
  }

  private async handleDebeziumEvent(
    registration: OutboxEntityRegistration<unknown>,
    event: DebeziumOutboxEvent,
  ): Promise<void> {
    console.log("Check event từ DebeziumOutboxEvent", event)
    // Debezium sends events for INSERT, UPDATE, DELETE
    // We only care about INSERT (op: 'c') for outbox pattern
    if (event.op !== 'c') {
      return;
    }

    const entry = event.after;
    if (!entry) {
      return;
    }

    // Skip if already processed
    if (entry.processed_at) {
      return;
    }

    // Skip if max retry exceeded
    if (entry.retry_count >= this.config.maxRetryCount) {
      this.logger.warn(
        `Outbox entry ${entry.id} exceeded max retry count (${this.config.maxRetryCount}), skipping`,
      );
      return;
    }

    try {
      const message: OutboxMessage = {
        id: entry.id,
        aggregateType: entry.aggregate_type,
        aggregateId: entry.aggregate_id,
        eventType: entry.event_type,
        payload:
          typeof entry.payload === 'string'
            ? JSON.parse(entry.payload)
            : entry.payload,
        createdAt: new Date(entry.created_at),
      };

      await this.messageQueue.publish(registration.topic, message);
      await this.markAsProcessed(registration, entry.id);

      this.logger.debug(
        `Published message ${entry.id} to topic ${registration.topic}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const newRetryCount = entry.retry_count + 1;

      await this.markAsFailed(registration, entry.id, errorMessage);

      if (newRetryCount >= this.config.maxRetryCount) {
        this.logger.error(
          `Outbox entry ${entry.id} failed permanently after ${newRetryCount} retries: ${errorMessage}`,
        );
      } else {
        this.logger.warn(
          `Outbox entry ${entry.id} failed (retry ${newRetryCount}/${this.config.maxRetryCount}): ${errorMessage}`,
        );
      }
    }
  }

  private async markAsProcessed(
    registration: OutboxEntityRegistration<unknown>,
    entryId: string,
  ): Promise<void> {
    const repository = this.dataSource.getRepository(registration.entity);

    await repository.update(entryId as any, {
      processedAt: new Date(),
      error: null,
    } as Partial<BaseOutboxEntity>);
  }

  private async markAsFailed(
    registration: OutboxEntityRegistration<unknown>,
    entryId: string,
    errorMessage: string,
  ): Promise<void> {
    const repository = this.dataSource.getRepository(registration.entity);

    await repository
      .createQueryBuilder()
      .update()
      .set({
        retryCount: () => 'retry_count + 1',
        error: errorMessage,
      } as any)
      .where('id = :id', { id: entryId })
      .execute();
  }
}
