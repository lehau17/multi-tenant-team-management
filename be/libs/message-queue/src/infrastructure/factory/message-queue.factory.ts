import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMessageQueuePort } from '../../domain/ports/message-queue.port';
import { MessageQueueStrategy } from '../../domain/types/message-queue.types';
import { KafkaMessageQueueStrategy } from '../strategies/kafka-message-queue.strategy';
import { RedisMessageQueueStrategy } from '../strategies/redis-message-queue.strategy';

@Injectable()
export class MessageQueueFactory implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessageQueueFactory.name);
  private instance: IMessageQueuePort;

  constructor(private readonly configService: ConfigService) {}

  create(): IMessageQueuePort {
    if (this.instance) {
      return this.instance;
    }

    const strategy =
      this.configService.get<string>('MESSAGE_QUEUE_STRATEGY') ||
      MessageQueueStrategy.REDIS;

    switch (strategy) {
      case MessageQueueStrategy.KAFKA:
        this.instance = new KafkaMessageQueueStrategy({
          brokers: (
            this.configService.get<string>('KAFKA_BROKERS') || 'localhost:9092'
          ).split(','),
          clientId:
            this.configService.get<string>('KAFKA_CLIENT_ID') || 'Monolitic-DDD-Multi-Tenant',
          groupId:
            this.configService.get<string>('KAFKA_GROUP_ID') ||
            'DDD-consumer-group',
        });
        break;

      case MessageQueueStrategy.REDIS:
        this.instance = new RedisMessageQueueStrategy({
          url: this.configService.get<string>('REDIS_URL') || 'localhost',
          password: this.configService.get<string>('REDIS_PASSWORD'),
        });
        break;

      default:
        throw new Error(`Unsupported message queue strategy: ${strategy}`);
    }

    this.logger.log(`Message queue strategy: ${strategy}`);
    return this.instance;
  }

  async onModuleInit(): Promise<void> {
    if (!this.instance) {
      this.create();
    }
    await this.instance.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect();
    }
  }
}
