export interface OutboxEntryData<TPayload = unknown> {
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: TPayload;
}

export interface OutboxMessage<TPayload = unknown> {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: TPayload;
  createdAt: Date;
}
