import { MessageQueueModule } from '@app/message-queue';
import { createTypeOrmConfig } from '@app/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './modules/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessageQueueModule,
    TypeOrmModule.forRootAsync(
      createTypeOrmConfig({
        entitiesPath: __dirname + '/**/*.orm-entity{.ts,.js}',
      }),
    ),
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class NotificationModule {}
