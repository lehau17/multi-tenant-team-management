import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MESSAGE_QUEUE_SERVICE } from './domain/ports/message-queue.port';
import { MessageQueueFactory } from './infrastructure/factory/message-queue.factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    MessageQueueFactory,
    {
      provide: MESSAGE_QUEUE_SERVICE,
      useFactory: (factory: MessageQueueFactory) => factory.create(),
      inject: [MessageQueueFactory],
    },
  ],
  exports: [MESSAGE_QUEUE_SERVICE],
})
export class MessageQueueModule {}
