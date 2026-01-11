import Redis from 'ioredis';
import { ICachePort } from '../../domain/ports/cache.port';

export class RedisCacheStrategy implements ICachePort {
  private readonly client: Redis;
  private readonly namespace: string;
  private readonly defaultTtlMs?: number;

  constructor(client: Redis, namespace: string, defaultTtlMs?: number) {
    this.client = client;
    this.namespace = namespace;
    this.defaultTtlMs = defaultTtlMs;
  }

  private prefixKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.client.get(this.prefixKey(key));
    if (raw === null) return undefined;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const prefixed = this.prefixKey(key);
    const serialized = JSON.stringify(value);
    const ttl = ttlMs ?? this.defaultTtlMs;

    if (ttl) {
      await this.client.set(prefixed, serialized, 'PX', ttl);
    } else {
      await this.client.set(prefixed, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.prefixKey(key));
  }

  async reset(): Promise<void> {
    const pattern = `${this.namespace}:*`;
    let cursor = '0';

    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } while (cursor !== '0');
  }

  async has(key: string): Promise<boolean> {
    const exists = await this.client.exists(this.prefixKey(key));
    return exists === 1;
  }

  async wrap<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await factory();
    await this.set(key, value, ttlMs);
    return value;
  }
}
