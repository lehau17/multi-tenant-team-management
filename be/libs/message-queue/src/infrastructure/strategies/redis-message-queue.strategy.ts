import { Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { IMessageQueuePort } from '../../domain/ports/message-queue.port';
import {
  MessageEnvelope,
  MessageHandler,
  RedisConfig,
} from '../../domain/types/message-queue.types';

export class RedisMessageQueueStrategy implements IMessageQueuePort {
  private readonly logger = new Logger(RedisMessageQueueStrategy.name);
  private readonly handlers = new Map<string, MessageHandler[]>();
  private pubClient: Redis;
  private subClient: Redis;

  constructor(private readonly config: RedisConfig) {}

  async connect(): Promise<void> {
    this.logger.log('Connecting Redis Pub/Sub...');

    const options : RedisOptions = {
      host: this.config.url,
      password: this.config.password,
      lazyConnect: true,
      reconnectOnError: () => true,
      retryStrategy: (times) => { },
    };

    this.pubClient = new Redis(options);
    this.subClient = new Redis(options);

    this.subClient.on('message', async (channel: string, message: string) => {
      const topicHandlers = this.handlers.get(channel);
      if (!topicHandlers?.length) return;

      try {
        const envelope: MessageEnvelope = JSON.parse(message);
        await Promise.all(topicHandlers.map((handler) => handler(envelope)));
      } catch (error) {
        this.logger.error(
          `Error processing message on topic "${channel}"`,
          error,
        );
      }
    });

    await this.pubClient.connect();
    await this.subClient.connect();

    this.logger.log('Redis Pub/Sub connected successfully');
  }

  async disconnect(): Promise<void> {
    this.logger.log('Disconnecting Redis Pub/Sub...');
    await this.subClient?.quit();
    await this.pubClient?.quit();
    this.handlers.clear();
    this.logger.log('Redis Pub/Sub disconnected');
  }

  async publish<T>(topic: string, data: T): Promise<void> {
    const envelope: MessageEnvelope<T> = {
      topic,
      data,
      timestamp: Date.now(),
    };

    await this.pubClient.publish(topic, JSON.stringify(envelope));
  }

  async subscribe<T>(
    topic: string,
    handler: MessageHandler<T>,
  ): Promise<void> {
    const existing = this.handlers.get(topic);
    if (existing) {
      existing.push(handler as MessageHandler);
    } else {
      this.handlers.set(topic, [handler as MessageHandler]);
      await this.subClient.subscribe(topic);
    }

    this.logger.log(`Subscribed to topic "${topic}"`);
  }

  async unsubscribe(topic: string): Promise<void> {
    this.handlers.delete(topic);
    await this.subClient.unsubscribe(topic);
    this.logger.log(`Unsubscribed from topic "${topic}"`);
  }
}
