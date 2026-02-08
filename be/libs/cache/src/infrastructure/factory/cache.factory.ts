import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICachePort } from '../../domain/ports/cache.port';
import { CacheModuleOptions, CacheStrategy } from '../../domain/types/cache-options.types';
import { MemoryCacheStrategy } from '../strategies/memory-cache.strategy';
import { RedisCacheStrategy } from '../strategies/redis-cache.strategy';

@Injectable()
export class CacheFactory {
  private redisClient: Redis | null = null;

  constructor(private readonly configService: ConfigService) { }

  create(options: CacheModuleOptions): ICachePort {
    switch (options.strategy) {
      case CacheStrategy.MEMORY:
        return new MemoryCacheStrategy(options.namespace, options.defaultTtlMs);

      case CacheStrategy.REDIS:
        return new RedisCacheStrategy(
          this.getRedisClient(),
          options.namespace,
          options.defaultTtlMs,
        );

      default:
        throw new Error(`Unknown cache strategy: ${options.strategy}`);
    }
  }

  private getRedisClient(): Redis {
    if (!this.redisClient) {
      const redisUrl = this.configService.get<string>(
        'REDIS_URL',
        'redis://localhost:6379',
      );
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

      this.redisClient = new Redis(redisUrl, {
        password: redisPassword || undefined,
        lazyConnect: true,
      });
    }

    return this.redisClient;
  }
}
