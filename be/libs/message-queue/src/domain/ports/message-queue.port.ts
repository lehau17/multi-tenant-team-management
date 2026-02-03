import { MessageHandler } from '../types/message-queue.types';

export const MESSAGE_QUEUE_SERVICE = Symbol('MESSAGE_QUEUE_SERVICE');

export interface IMessageQueuePort {
  publish<T>(topic: string, data: T): Promise<void>;
  subscribe<T>(topic: string, handler: MessageHandler<T>): Promise<void>;
  unsubscribe(topic: string): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
