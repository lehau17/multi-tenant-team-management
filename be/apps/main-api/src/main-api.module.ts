import { CacheModule, SharedModule } from '@app/shared';
import { AllExceptionsFilter } from '@app/shared/filters/global-exception.filter';
import { JwtAuthGuard } from '@app/shared/guard/jwt-auth.guard';
import { GlobalValidationPipe } from '@app/shared/pipe/global-validation.pipe';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { IdentityModule } from './modules/identity/identity.module';
import { ProjectModule } from './modules/project/project.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SharedModule,
    CacheModule.forRoot(),
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10), // Parse INT cho chắc
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
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
      }),
    }),
    IdentityModule,
    WorkspaceModule,
    ProjectModule,
    SubscriptionModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class MainApiModule { }
