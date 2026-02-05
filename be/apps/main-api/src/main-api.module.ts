import { MessageQueueModule } from '@app/message-queue';
import { OutboxModule } from '@app/outbox';
import { createTypeOrmConfig, IamModule, SharedModule } from '@app/shared';
import { AllExceptionsFilter } from '@app/shared/filters/global-exception.filter';
import { JwtAuthGuard } from '@app/shared/guard/jwt-auth.guard';
import { GlobalValidationPipe } from '@app/shared/pipe/global-validation.pipe';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
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
    IamModule,
    // CacheModule.forRoot(),
    MessageQueueModule,
    OutboxModule.forRoot(),
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRootAsync(
      createTypeOrmConfig({
        entitiesPath: __dirname + '/**/*.orm-entity{.ts,.js}',
      }),
    ),
    IdentityModule,
    WorkspaceModule,
    ProjectModule,
    SubscriptionModule,
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
    },
  ],
})
export class MainApiModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    addTransactionalDataSource(this.dataSource);
  }
}
