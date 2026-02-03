import {
  DynamicModule,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OUTBOX_PROCESSOR_SERVICE } from './domain/ports/outbox-processor.port';
import { OUTBOX_SERVICE } from './domain/ports/outbox.port';
import {
  OutboxConfig,
  OutboxEntityRegistration,
  OutboxStrategy,
} from './domain/types/outbox.types';
import { OutboxProcessorFactory } from './infrastructure/factory/outbox-processor.factory';
import { OutboxEntityRegistry } from './infrastructure/registry/outbox-entity.registry';
import { OutboxService } from './infrastructure/services/outbox.service';
import { OUTBOX_CONFIG } from './infrastructure/tokens';

@Module({})
export class OutboxModule implements OnModuleInit, OnModuleDestroy {
  static forRoot(): DynamicModule {
    return {
      module: OutboxModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        OutboxEntityRegistry,
        {
          provide: OUTBOX_CONFIG,
          useFactory: (configService: ConfigService): OutboxConfig => ({
            strategy:
              (configService.get<string>('OUTBOX_STRATEGY') as OutboxStrategy) ||
              OutboxStrategy.POLLING,
            pollingIntervalMs:
              configService.get<number>('OUTBOX_POLLING_INTERVAL_MS') || 5000,
            maxRetryCount:
              configService.get<number>('OUTBOX_MAX_RETRY_COUNT') || 3,
            batchSize: configService.get<number>('OUTBOX_BATCH_SIZE') || 100,
          }),
          inject: [ConfigService],
        },
        OutboxService,
        {
          provide: OUTBOX_SERVICE,
          useExisting: OutboxService,
        },
        OutboxProcessorFactory,
        {
          provide: OUTBOX_PROCESSOR_SERVICE,
          useFactory: (factory: OutboxProcessorFactory) => factory.create(),
          inject: [OutboxProcessorFactory],
        },
      ],
      exports: [
        OUTBOX_SERVICE,
        OUTBOX_PROCESSOR_SERVICE,
        OutboxEntityRegistry,
        OUTBOX_CONFIG,
      ],
    };
  }

  static forFeature(
    registrations: OutboxEntityRegistration[],
  ): DynamicModule {
    return {
      module: OutboxModule,
      providers: [
        {
          provide: 'OUTBOX_FEATURE_REGISTRATIONS',
          useFactory: (registry: OutboxEntityRegistry) => {
            for (const registration of registrations) {
              registry.register(registration);
            }
            return registrations;
          },
          inject: [OutboxEntityRegistry],
        },
      ],
    };
  }

  constructor(private readonly processorFactory: OutboxProcessorFactory) {}

  async onModuleInit(): Promise<void> {
    const processor = this.processorFactory.create();
    await processor.start();
  }

  async onModuleDestroy(): Promise<void> {
    const processor = this.processorFactory.create();
    await processor.stop();
  }
}
