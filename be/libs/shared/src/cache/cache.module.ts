import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CACHE_SERVICE } from './domain/ports/cache.port';
import { CacheModuleOptions } from './domain/types/cache-options.types';
import { CacheFactory } from './infrastructure/factory/cache.factory';

@Module({})
export class CacheModule {
  static forRoot(): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      imports: [ConfigModule],
      providers: [CacheFactory],
      exports: [CacheFactory],
    };
  }

  static forFeature(options: CacheModuleOptions): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CACHE_SERVICE,
          useFactory: (factory: CacheFactory) => factory.create(options),
          inject: [CacheFactory],
        },
      ],
      exports: [CACHE_SERVICE],
    };
  }
}
