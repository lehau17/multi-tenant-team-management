import { Injectable } from '@nestjs/common';
import { OutboxEntityRegistration } from '../../domain/types/outbox.types';

@Injectable()
export class OutboxEntityRegistry {
  private readonly registrations = new Map<
    string,
    OutboxEntityRegistration<unknown>
  >();

  register<T>(registration: OutboxEntityRegistration<T>): void {
    this.registrations.set(registration.tableName, registration);
  }

  getAll(): OutboxEntityRegistration<unknown>[] {
    return Array.from(this.registrations.values());
  }

  getByTableName(
    tableName: string,
  ): OutboxEntityRegistration<unknown> | undefined {
    return this.registrations.get(tableName);
  }

  getByEntity<T>(
    entityClass: new () => T,
  ): OutboxEntityRegistration<T> | undefined {
    for (const registration of this.registrations.values()) {
      if (registration.entity === entityClass) {
        return registration as OutboxEntityRegistration<T>;
      }
    }
    return undefined;
  }
}
