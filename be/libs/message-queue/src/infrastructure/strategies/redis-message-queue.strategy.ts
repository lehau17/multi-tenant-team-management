import { EVENT_LISTENER_METADATA } from '@app/shared/decorator/event-listener.decorator';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import Redis, { RedisOptions } from 'ioredis';
import { IMessageQueuePort } from '../../domain/ports/message-queue.port';
import {
  MessageEnvelope,
  MessageHandler
} from '../../domain/types/message-queue.types';

@Injectable()
export class RedisMessageQueueStrategy
  implements IMessageQueuePort, OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(RedisMessageQueueStrategy.name);
  private readonly handlers = new Map<string, MessageHandler[]>();
  private pubClient: Redis;
  private subClient: Redis;

  private readonly redisUrl: string;
  private readonly redisPassword?: string;

constructor(
    private readonly configService: ConfigService,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {
    this.redisUrl = this.configService.get<string>('REDIS_URL') || 'localhost';
    this.redisPassword = this.configService.get<string>('REDIS_PASSWORD');
  }

  async onModuleInit() {
    await this.connect();
    await this.registerListeners();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async registerListeners() {
    const controllers = this.discoveryService.getControllers();

    for (const wrapper of controllers) {
      const { instance } = wrapper;
      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);
      this.metadataScanner.scanFromPrototype(instance, prototype, (methodName) => {
        const topic = this.reflector.get(EVENT_LISTENER_METADATA, instance[methodName]);

        if (topic) {
          this.logger.log(`🔗 Auto-binding Redis: Topic "${topic}" -> ${instance.constructor.name}.${methodName}`);

          const handlerWrapper: MessageHandler = async (envelope, ack) => {
            await instance[methodName].call(instance, envelope, ack);
          };

          this.subscribe(topic, handlerWrapper);
        }
      });
    }
  }

  async connect(): Promise<void> {
    this.logger.log('Connecting Redis Pub/Sub...');

    const options: RedisOptions = {
      host: this.redisUrl,
      password: this.redisPassword,
      lazyConnect: true,
      reconnectOnError: () => true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    };

    this.pubClient = new Redis(options);
    this.subClient = new Redis(options);

    // 👇 XỬ LÝ NHẬN TIN NHẮN
    this.subClient.on('message', async (channel: string, message: string) => {
      const topicHandlers = this.handlers.get(channel);
      if (!topicHandlers?.length) return;

      try {
        const envelope: MessageEnvelope = JSON.parse(message);

        const noOpAck = async () => { /* Redis doesn't support ack */ };

        await Promise.all(
          topicHandlers.map((handler) => handler(envelope, noOpAck))
        );
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
      // Chỉ subscribe Redis channel 1 lần
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
