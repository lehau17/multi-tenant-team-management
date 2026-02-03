import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, IsNull, LessThan } from 'typeorm';
import { IOutboxProcessorPort } from '../../domain/ports/outbox-processor.port';
import { OutboxEntityRegistration, OutboxConfig } from '../../domain/types/outbox.types';
import { OutboxMessage } from '../../domain/types/outbox-entry.types';
import { BaseOutboxEntity } from '../../domain/entity/base-outbox.entity';
import { OutboxEntityRegistry } from '../registry/outbox-entity.registry';
import { OUTBOX_CONFIG } from '../tokens';
import {
  IMessageQueuePort,
  MESSAGE_QUEUE_SERVICE,
} from '@app/message-queue';

@Injectable()
export class CdcOutboxStrategy implements IOutboxProcessorPort {
  private readonly logger = new Logger(CdcOutboxStrategy.name);
  private notifyConnection: any = null;
  private isListening = false;

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
    if (this.isListening) {
      return;
    }

    this.logger.log('Starting CDC outbox processor with PostgreSQL LISTEN/NOTIFY');

    const registrations = this.registry.getAll();
    if (registrations.length === 0) {
      this.logger.warn('No outbox entities registered');
      return;
    }

    await this.setupNotifyListener();
    this.isListening = true;

    await this.processUnprocessedEntries();
  }

  async stop(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    if (this.notifyConnection) {
      const registrations = this.registry.getAll();
      for (const registration of registrations) {
        const channel = `outbox_${registration.tableName}`;
        await this.notifyConnection.query(`UNLISTEN ${channel}`);
      }
      await this.notifyConnection.release();
      this.notifyConnection = null;
    }

    this.isListening = false;
    this.logger.log('CDC outbox processor stopped');
  }

  private async setupNotifyListener(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    this.notifyConnection = queryRunner;

    const registrations = this.registry.getAll();
    for (const registration of registrations) {
      const channel = `outbox_${registration.tableName}`;
      await queryRunner.query(`LISTEN ${channel}`);
      this.logger.log(`Listening on channel: ${channel}`);
    }

    const connection = queryRunner.connection;
    const driver = connection.driver as any;

    if (driver.master) {
      driver.master.on('notification', async (msg: any) => {
        await this.handleNotification(msg);
      });
    }
  }

  private async handleNotification(msg: { channel: string; payload: string }): Promise<void> {
    try {
      const tableName = msg.channel.replace('outbox_', '');
      const registration = this.registry.getByTableName(tableName);

      if (!registration) {
        this.logger.warn(`No registration found for table: ${tableName}`);
        return;
      }

      const entryId = msg.payload;
      await this.processEntryById(registration, entryId);
    } catch (error) {
      this.logger.error('Error handling notification', error);
    }
  }

  private async processEntryById(
    registration: OutboxEntityRegistration<unknown>,
    entryId: string,
  ): Promise<void> {
    const repository = this.dataSource.getRepository(registration.entity);

    const entry = await repository.findOne({
      where: { id: entryId } as any,
    });

    if (!entry) {
      this.logger.warn(`Entry not found: ${entryId}`);
      return;
    }

    await this.processEntry(registration, entry as BaseOutboxEntity);
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

  private async processUnprocessedEntries(): Promise<void> {
    const registrations = this.registry.getAll();

    for (const registration of registrations) {
      const repository = this.dataSource.getRepository(registration.entity);

      const entries = await repository.find({
        where: {
          processedAt: IsNull(),
          retryCount: LessThan(this.config.maxRetryCount),
        } as any,
        order: { createdAt: 'ASC' } as any,
        take: this.config.batchSize,
      });

      for (const entry of entries) {
        await this.processEntry(registration, entry as BaseOutboxEntity);
      }
    }
  }
}
