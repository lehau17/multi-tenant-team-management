import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export type TypeOrmConfigOptions = {
  entitiesPath?: string;
}

export const createTypeOrmConfig = (options?: TypeOrmConfigOptions): TypeOrmModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT'), 10),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: options?.entitiesPath ? [options.entitiesPath] : [],
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      max: parseInt(configService.get<string>('DB_POOL_MAX') || '20', 10),
      min: parseInt(configService.get<string>('DB_POOL_MIN') || '5', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    logging: configService.get<string>('NODE_ENV') !== 'production',
    retryAttempts: 100,
    retryDelay: 3000,
  }),
});
