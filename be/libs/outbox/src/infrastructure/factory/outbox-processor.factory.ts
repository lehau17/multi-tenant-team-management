import { IMessageQueuePort, MESSAGE_QUEUE_SERVICE } from '@app/message-queue';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOutboxStrategyPort } from '../../domain/ports/outbox-strategy.port';
import { OutboxConfig } from '../../domain/types/outbox.types';
import { DebeziumOutboxStrategy } from '../strategies/debezium-outbox.strategy';
import { OUTBOX_CONFIG } from '../tokens';

@Injectable()
export class OutboxProcessorFactory {
  private readonly logger = new Logger(OutboxProcessorFactory.name);
  private initialized = false;

  constructor(
    private readonly debeziumStrategy: DebeziumOutboxStrategy,
    @Inject(OUTBOX_CONFIG)
    private readonly config: OutboxConfig,
    @Inject(MESSAGE_QUEUE_SERVICE)
    private readonly messageQueue: IMessageQueuePort,
  ) {}

  getStrategy(): IOutboxStrategyPort {
    this.ensureInitialized();
    return this.debeziumStrategy;
  }

  private ensureInitialized(): void {
    if (this.initialized) {
      return;
    }

    this.debeziumStrategy.initialize(this.config, this.messageQueue);
    this.initialized = true;

    this.logger.log('Debezium outbox processor initialized');
  }
}
