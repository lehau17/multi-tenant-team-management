import { AllExceptionsFilter } from '@app/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendEmailCommandHandler } from './application/command/send-email.handler';
import { EMAIL_SENDER_PORT } from './domain/port/email-sender.port';
import { NOTIFICATION_TEMPLATE_REPOSITORY_PORT } from './domain/port/notification-template.repository.port';
import { EmailSenderFactory } from './infrastructure/adapter/email/email-sender.factory';
import { NotificationTemplateRepository } from './infrastructure/adapter/repository/notification-template.repository';
import { LoggingInterceptor } from './infrastructure/interceptor/logging.interceptor';
import { NotificationTemplateTranslationOrmEntity } from './infrastructure/persistence/notification-template-translation.orm-entity';
import { NotificationTemplateOrmEntity } from './infrastructure/persistence/notification-template.orm-entity';
import { SendEmailConsumer } from './interface/consumer/send-email.consumer';
import { NotificationController } from './interface/http/notification.controller';

const CommandHandlers = [SendEmailCommandHandler];

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    TypeOrmModule.forFeature([
      NotificationTemplateOrmEntity,
      NotificationTemplateTranslationOrmEntity,
    ]),
  ],
  controllers: [NotificationController, SendEmailConsumer],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    EmailSenderFactory,
    {
      provide: EMAIL_SENDER_PORT,
      useFactory: (factory: EmailSenderFactory) => factory.create(),
      inject: [EmailSenderFactory],
    },
    {
      provide: NOTIFICATION_TEMPLATE_REPOSITORY_PORT,
      useClass: NotificationTemplateRepository,
    },
    ...CommandHandlers,
  ],
  exports: [
    EMAIL_SENDER_PORT,
    NOTIFICATION_TEMPLATE_REPOSITORY_PORT,
    EmailSenderFactory,
  ],
})
export class CoreModule {}
