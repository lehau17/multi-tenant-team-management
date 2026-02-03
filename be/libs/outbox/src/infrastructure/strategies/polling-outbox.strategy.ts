import {
  IMessageQueuePort,
  MESSAGE_QUEUE_SERVICE,
} from '@app/message-queue';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, IsNull, LessThan } from 'typeorm';
import { BaseOutboxEntity } from '../../domain/entity/base-outbox.entity';
import { IOutboxProcessorPort } from '../../domain/ports/outbox-processor.port';
import { OutboxMessage } from '../../domain/types/outbox-entry.types';
import { OutboxConfig, OutboxEntityRegistration } from '../../domain/types/outbox.types';
import { OutboxEntityRegistry } from '../registry/outbox-entity.registry';
import { OUTBOX_CONFIG } from '../tokens';

@Injectable()
export class PollingOutboxStrategy implements IOutboxProcessorPort {
  private readonly logger = new Logger(PollingOutboxStrategy.name);
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly dataSource: DataSource,
    private readonly registry: OutboxEntityRegistry,
    @Inject(OUTBOX_CONFIG)
    private readonly config: OutboxConfig,
    @Inject(MESSAGE_QUEUE_SERVICE)
    private readonly messageQueue: IMessageQueuePort,
  ) {}

  register<T>(registration: OutboxEntityRegistration<T>): void {
    this.registry.register(registration);
  }

  async start(): Promise<void> {
    if (this.intervalId) {
      return;
    }

    this.logger.log(
      `Starting polling outbox processor with interval ${this.config.pollingIntervalMs}ms`,
    );

    this.intervalId = setInterval(
      () => this.processAllOutboxes(),
      this.config.pollingIntervalMs,
    );

    await this.processAllOutboxes();
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.logger.log('Polling outbox processor stopped');
    }
  }

  private async processAllOutboxes(): Promise<void> {
    const registrations = this.registry.getAll();

    for (const registration of registrations) {
      await this.processOutbox(registration);
    }
  }

  private async processOutbox(
    registration: OutboxEntityRegistration<unknown>,
  ): Promise<void> {
    const repository = this.dataSource.getRepository(registration.entity);

    try {
      const entries = await repository.find({
        where: {
          processedAt: IsNull(),
          retryCount: LessThan(this.config.maxRetryCount),
        } ,
        order: { createdAt: 'ASC' },
        take: this.config.batchSize,
      });

      if (entries.length === 0) {
        return;
      }

      this.logger.debug(
        `Processing ${entries.length} entries from ${registration.tableName}`,
      );

      for (const entry of entries) {
        await this.processEntry(registration, entry as BaseOutboxEntity);
      }
    } catch (error) {
      this.logger.error(
        `Error processing outbox ${registration.tableName}`,
        error,
      );
    }
  }

  private async processEntry(
    registration: OutboxEntityRegistration<unknown>,
    entry: BaseOutboxEntity,
  ): Promise<void> {
    const repository = this.dataSource.getRepository(registration.entity);

    try {
      const message: OutboxMessage = {
        id: entry.id,
        aggregateType: entry.aggregateType,
        aggregateId: entry.aggregateId,
        eventType: entry.eventType,
        payload: entry.payload,
        createdAt: entry.createdAt,
      };

      await this.messageQueue.publish(registration.topic, message);

      await repository.update(entry.id as any, {
        processedAt: new Date(),
        error: null,
      } as any);

      this.logger.debug(
        `Published message ${entry.id} to topic ${registration.topic}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await repository.update(entry.id as any, {
        retryCount: entry.retryCount + 1,
        error: errorMessage,
      } as any);

      this.logger.error(
        `Failed to process outbox entry ${entry.id}: ${errorMessage}`,
      );
    }
  }
}
