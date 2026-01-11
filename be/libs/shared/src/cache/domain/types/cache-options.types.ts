export enum CacheStrategy {
  MEMORY = 'memory',
  REDIS = 'redis',
}

export interface CacheModuleOptions {
  strategy: CacheStrategy;
  namespace: string;
  defaultTtlMs?: number;
}

export interface CacheModuleRootOptions {
  redisUrl?: string;
}
