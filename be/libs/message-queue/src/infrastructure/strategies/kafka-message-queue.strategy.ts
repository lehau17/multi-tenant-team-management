import { Logger } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { IMessageQueuePort } from '../../domain/ports/message-queue.port';
import {
  KafkaConfig,
  MessageEnvelope,
  MessageHandler,
} from '../../domain/types/message-queue.types';

export class KafkaMessageQueueStrategy implements IMessageQueuePort {
  private readonly logger = new Logger(KafkaMessageQueueStrategy.name);
  private readonly handlers = new Map<string, MessageHandler[]>();
  private readonly subscribedTopics = new Set<string>();
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private consumerRunning = false;

  constructor(private readonly config: KafkaConfig) {}

  async connect(): Promise<void> {
    this.logger.log('Connecting Kafka...');

    this.kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: this.config.brokers,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.config.groupId });

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
        eachMessage: async ({ topic: msgTopic, message }) => {
          const topicHandlers = this.handlers.get(msgTopic);
          if (!topicHandlers?.length) return;

          try {
            const envelope: MessageEnvelope = JSON.parse(
              message.value?.toString() || '{}',
            );
            await Promise.all(
              topicHandlers.map((handler) => handler(envelope)),
            );
          } catch (error) {
            this.logger.error(
              `Error processing message on topic "${msgTopic}"`,
              error,
            );
          }
        },
      });
    }

    this.logger.log(`Subscribed to topic "${topic}"`);
  }

  async unsubscribe(topic: string): Promise<void> {
    this.handlers.delete(topic);
    this.subscribedTopics.delete(topic);
    this.logger.log(`Unsubscribed from topic "${topic}"`);
  }
}
