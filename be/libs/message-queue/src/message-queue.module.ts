import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { MESSAGE_QUEUE_SERVICE } from './domain/ports/message-queue.port';
import { MessageQueueStrategy } from './domain/types/message-queue.types';
import { KafkaMessageQueueStrategy } from './infrastructure/strategies/kafka-message-queue.strategy';
import { RedisMessageQueueStrategy } from './infrastructure/strategies/redis-message-queue.strategy';

@Global()
@Module({
    imports : [DiscoveryModule],
  providers: [
    {
      provide: MESSAGE_QUEUE_SERVICE,
      useFactory: (
        configService: ConfigService,
        discoveryService: DiscoveryService,
        metadataScanner: MetadataScanner,
        reflector: Reflector,
      ) => {
        const strategyType =
          configService.get<string>('MESSAGE_QUEUE_STRATEGY') ||
          MessageQueueStrategy.KAFKA;

        switch (strategyType) {
          case MessageQueueStrategy.KAFKA:
            return new KafkaMessageQueueStrategy(
              configService,
              discoveryService,
              metadataScanner,
              reflector,
            );

          case MessageQueueStrategy.REDIS:
            return new RedisMessageQueueStrategy(
              configService,
              discoveryService,
              metadataScanner,
              reflector,
            );

          default:
            throw new Error(`Unsupported message queue strategy: ${strategyType}`);
        }
      },
      inject: [
        ConfigService,
        DiscoveryService,
        MetadataScanner,
        Reflector,
      ],
    },
  ],
  exports: [MESSAGE_QUEUE_SERVICE],
})
export class MessageQueueModule {}
