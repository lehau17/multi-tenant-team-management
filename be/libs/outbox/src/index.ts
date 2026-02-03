// Public API
export { OutboxModule } from './outbox.module';
export { OUTBOX_REPOSITORY, IOutboxRepository } from './domain/ports/outbox.port';
export { OutboxEntityRegistration } from './domain/types/outbox.types';
export { OutboxEntryData, OutboxMessage } from './domain/types/outbox-entry.types';
export { BaseOutboxEntity } from './domain/entity/base-outbox.entity';
