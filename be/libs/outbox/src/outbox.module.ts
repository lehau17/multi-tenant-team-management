import {
  DynamicModule,
  Module,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OUTBOX_REPOSITORY } from './domain/ports/outbox.port';
import { OutboxEntityRegistration } from './domain/types/outbox.types';
import { OutboxProcessorFactory } from './infrastructure/factory/outbox-processor.factory';
import { OutboxRepository } from './infrastructure/persistence/outbox.repository';
import { OutboxEntityRegistry } from './infrastructure/registry/outbox-entity.registry';
import { DebeziumOutboxStrategy } from './infrastructure/strategies/debezium-outbox.strategy';

const OUTBOX_REGISTRATIONS = Symbol('OUTBOX_REGISTRATIONS');

@Module({})
export class OutboxModule implements OnApplicationBootstrap, OnModuleDestroy {
  static forRoot(): DynamicModule {
    return {
      module: OutboxModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        OutboxEntityRegistry,
        {
          provide: OUTBOX_REPOSITORY,
          useClass: OutboxRepository,
        },
        DebeziumOutboxStrategy,
        OutboxProcessorFactory,
      ],
      exports: [OUTBOX_REPOSITORY, OutboxProcessorFactory, OutboxEntityRegistry],
    };
  }

  static forFeature(registrations: OutboxEntityRegistration[]): DynamicModule {
    return {
      module: OutboxModule,
      providers: [
        {
          provide: OUTBOX_REGISTRATIONS, // TRIGGER Not export
          useFactory: (registry: OutboxEntityRegistry) => {
            registrations.forEach((reg) => registry.register(reg));
          },
          inject: [OutboxEntityRegistry],
        },
      ],
    };
  }

  constructor(private readonly processorFactory: OutboxProcessorFactory) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.processorFactory.getStrategy().start();
  }

  async onModuleDestroy(): Promise<void> {
    await this.processorFactory.getStrategy().stop();
  }
}
