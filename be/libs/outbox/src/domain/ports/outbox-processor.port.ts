import { OutboxEntityRegistration } from '../types/outbox.types';

export const OUTBOX_PROCESSOR_SERVICE = Symbol('OUTBOX_PROCESSOR_SERVICE');

export interface IOutboxProcessorPort {
  register<T>(registration: OutboxEntityRegistration<T>): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}
