import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IOutboxProcessorPort } from '../../domain/ports/outbox-processor.port';
import { OutboxConfig, OutboxStrategy } from '../../domain/types/outbox.types';
import { OutboxEntityRegistry } from '../registry/outbox-entity.registry';
import { PollingOutboxStrategy } from '../strategies/polling-outbox.strategy';
import { CdcOutboxStrategy } from '../strategies/cdc-outbox.strategy';
import { OUTBOX_CONFIG } from '../tokens';
import { IMessageQueuePort, MESSAGE_QUEUE_SERVICE } from '@app/message-queue';

@Injectable()
export class OutboxProcessorFactory {
  private readonly logger = new Logger(OutboxProcessorFactory.name);
  private instance: IOutboxProcessorPort | null = null;

  constructor(
    private readonly dataSource: DataSource,
    private readonly registry: OutboxEntityRegistry,
    @Inject(OUTBOX_CONFIG)
    private readonly config: OutboxConfig,
    @Inject(MESSAGE_QUEUE_SERVICE)
    private readonly messageQueue: IMessageQueuePort,
  ) {}

  create(): IOutboxProcessorPort {
    if (this.instance) {
      return this.instance;
    }

    switch (this.config.strategy) {
      case OutboxStrategy.POLLING:
        this.instance = new PollingOutboxStrategy(
          this.dataSource,
          this.registry,
          this.config,
          this.messageQueue,
        );
        break;

      case OutboxStrategy.CDC:
        this.instance = new CdcOutboxStrategy(
          this.dataSource,
          this.registry,
          this.config,
          this.messageQueue,
        );
        break;

      default:
        throw new Error(`Unsupported outbox strategy: ${this.config.strategy}`);
    }

    this.logger.log(`Outbox processor strategy: ${this.config.strategy}`);
    return this.instance;
  }
}
