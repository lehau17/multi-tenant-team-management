import { OutboxEntityRegistration } from '../types/outbox.types';

export const OUTBOX_STRATEGY_SERVICE = Symbol('OUTBOX_STRATEGY_SERVICE');

export interface IOutboxStrategyPort {
  register<T>(registration: OutboxEntityRegistration<T>): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}
