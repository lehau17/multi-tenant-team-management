export interface DebeziumConfig {
  serverName: string;
  schemaName: string;
  maxRetryCount: number;
}

export interface OutboxEntityRegistration<T = unknown> {
  entity: new () => T;
  topic: string;
  tableName: string;
}

// Debezium CDC event structure
export interface DebeziumOutboxEvent {
  // Operation type: c = create, u = update, d = delete, r = read (snapshot)
  op: 'c' | 'u' | 'd' | 'r';
  // State before the change (null for INSERT)
  before: DebeziumOutboxPayload | null;
  // State after the change (null for DELETE)
  after: DebeziumOutboxPayload | null;
  // Source metadata
  source: {
    version: string;
    connector: string;
    name: string;
    ts_ms: number;
    snapshot: string;
    db: string;
    schema: string;
    table: string;
  };
  ts_ms: number;
}

export interface DebeziumOutboxPayload {
  id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  payload: string | Record<string, unknown>;
  created_at: string | number;
  processed_at: string | null;
  retry_count: number;
  error: string | null;
}
