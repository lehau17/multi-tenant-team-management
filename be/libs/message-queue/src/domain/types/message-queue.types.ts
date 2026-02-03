export enum MessageQueueStrategy {
  KAFKA = 'kafka',
  REDIS = 'redis',
}

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
}

export interface RedisConfig {
  url: string;
  password?: string;
}

export interface MessageEnvelope<T = unknown> {
  topic: string;
  data: T;
  timestamp: number;
  messageId?: string;
}

export type MessageHandler<T = unknown> = (
  message: MessageEnvelope<T>,
) => Promise<void>;
