export const CACHE_SERVICE = Symbol('CACHE_SERVICE');

export interface ICachePort {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  del(key: string): Promise<void>;
  reset(): Promise<void>;
  has(key: string): Promise<boolean>;
  wrap<T>(key: string, factory: () => Promise<T>, ttlMs?: number): Promise<T>;
}
