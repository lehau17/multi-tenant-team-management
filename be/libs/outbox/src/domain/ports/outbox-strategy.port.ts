import { IMessageQueuePort } from '@app/message-queue';
import { OutboxConfig, OutboxEntityRegistration } from '../types/outbox.types';

export const OUTBOX_STRATEGY_SERVICE = Symbol('OUTBOX_STRATEGY_SERVICE');

export interface IOutboxStrategyPort {
  initialize(config: OutboxConfig, messageQueue: IMessageQueuePort): void;
  register<T>(registration: OutboxEntityRegistration<T>): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}
