import { Injectable } from '@nestjs/common';
import { IOutboxStrategyPort } from '../../domain/ports/outbox-strategy.port';
import { DebeziumOutboxStrategy } from '../strategies/debezium-outbox.strategy';

@Injectable()
export class OutboxProcessorFactory {
  constructor(private readonly debeziumStrategy: DebeziumOutboxStrategy) {}

  getStrategy(): IOutboxStrategyPort {
    return this.debeziumStrategy;
  }
}
