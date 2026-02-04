import { EVENT_LISTENER_METADATA } from '@app/shared/decorator/event-listener.decorator';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'; // 👈 1. Import bộ công cụ quét
import { Consumer, Kafka, Producer } from 'kafkajs';
import { IMessageQueuePort } from '../../domain/ports/message-queue.port';
import {
  MessageEnvelope,
  MessageHandler
} from '../../domain/types/message-queue.types';
// Giả định bạn đã định nghĩa constant này ở file decorator

@Injectable()
export class KafkaMessageQueueStrategy
  implements IMessageQueuePort, OnModuleInit, OnModuleDestroy { // 👈 2. Implement lifecycle hooks

  private readonly logger = new Logger(KafkaMessageQueueStrategy.name);
  private readonly handlers = new Map<string, MessageHandler[]>();
  private readonly subscribedTopics = new Set<string>();

  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private consumerRunning = false;

  private readonly brokers: string[];
  private readonly clientId: string;
  private readonly groupId: string;


constructor(
    private readonly configService: ConfigService,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {
    this.brokers = (this.configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(',');
    this.clientId = this.configService.get<string>('KAFKA_CLIENT_ID') || 'my-app';
    this.groupId = this.configService.get<string>('KAFKA_GROUP_ID') || 'my-group';
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
      console.log("Check prototype", prototype)
      this.metadataScanner.scanFromPrototype(instance, prototype, (methodName) => {
        const topic = this.reflector.get(EVENT_LISTENER_METADATA, instance[methodName]);

        if (topic) {
          this.logger.log(`Auto-binding: Topic "${topic}" -> ${instance.constructor.name}.${methodName}`);

          const handlerWrapper: MessageHandler = async (envelope, ack) => {
            await instance[methodName].call(instance, envelope, ack);
          };

          this.subscribe(topic, handlerWrapper);
        }
      });
    }
  }

async connect(): Promise<void> {
    this.logger.log(`Connecting Kafka to brokers: ${this.brokers.join(',')}`);

    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.groupId });

    await this.producer.connect();
    await this.consumer.connect();

    this.logger.log('Kafka connected successfully');
  }
  async disconnect(): Promise<void> {
    this.logger.log('Disconnecting Kafka...');
    await this.consumer?.disconnect();
    await this.producer?.disconnect();
    this.handlers.clear();
    this.subscribedTopics.clear();
    this.consumerRunning = false;
    this.logger.log('Kafka disconnected');
  }

  async publish<T>(topic: string, data: T): Promise<void> {
    const envelope: MessageEnvelope<T> = {
      topic,
      data,
      timestamp: Date.now(),
    };

    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(envelope) }],
    });
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
    }

    if (!this.subscribedTopics.has(topic)) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.subscribedTopics.add(topic);
    }

    if (!this.consumerRunning) {
      this.consumerRunning = true;
      await this.consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic: msgTopic, message, partition }) => {
          const topicHandlers = this.handlers.get(msgTopic);
          if (!topicHandlers?.length) return;

          try {
            const envelope: MessageEnvelope = JSON.parse(
              message.value?.toString() || '{}',
            );

            const ack = async () => {
              await this.consumer.commitOffsets([{
                topic: msgTopic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              }]);
            };

            await Promise.all(
              topicHandlers.map((handler) => handler(envelope, ack)),
            );
          } catch (error) {
            this.logger.error(
              `Error processing message on topic "${msgTopic}"`,
              error,
            );
            // Có thể implement logic Dead Letter Queue ở đây nếu cần
          }
        },
      });
    }

    this.logger.log(`Subscribed to topic "${topic}"`);
  }

  async unsubscribe(topic: string): Promise<void> {
    this.handlers.delete(topic);
    // Lưu ý: KafkaJS không hỗ trợ unsubscribe 1 topic cụ thể khi đang run
    // nên ta chỉ xóa khỏi Map handlers để nó ngừng xử lý logic thôi.
    this.logger.log(`Unsubscribed from topic "${topic}"`);
  }
}
