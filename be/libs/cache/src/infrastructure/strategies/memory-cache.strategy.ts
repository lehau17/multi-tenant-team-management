import { ICachePort } from '../../domain/ports/cache.port';

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number | null;
}

export class MemoryCacheStrategy implements ICachePort {
  private readonly store = new Map<string, CacheEntry>();
  private readonly namespace: string;
  private readonly defaultTtlMs?: number;

  constructor(namespace: string, defaultTtlMs?: number) {
    this.namespace = namespace;
    this.defaultTtlMs = defaultTtlMs;
  }

  private prefixKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    if (entry.expiresAt === null) return false;
    return Date.now() > entry.expiresAt;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const prefixed = this.prefixKey(key);
    const entry = this.store.get(prefixed);

    if (!entry) return undefined;

    if (this.isExpired(entry)) {
      this.store.delete(prefixed);
      return undefined;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const prefixed = this.prefixKey(key);
    const ttl = ttlMs ?? this.defaultTtlMs;
    const expiresAt = ttl ? Date.now() + ttl : null;

    this.store.set(prefixed, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.store.delete(this.prefixKey(key));
  }

  async reset(): Promise<void> {
    const prefix = `${this.namespace}:`;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async has(key: string): Promise<boolean> {
    const prefixed = this.prefixKey(key);
    const entry = this.store.get(prefixed);

    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.store.delete(prefixed);
      return false;
    }

    return true;
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
