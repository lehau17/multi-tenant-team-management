import { MessageEnvelope } from '@app/message-queue';
import { OutboxMessage } from '@app/outbox';
import { OnEventConsumer, WorkspaceCreatedPayload } from '@app/shared';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateDefaultPrioritySchemesCommand } from '../../application/command/create-default-priority-schemes/create-default-priority-schemes.command';

@Controller()
export class WorkspaceCreatedConsumer {
  private readonly logger = new Logger(WorkspaceCreatedConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @OnEventConsumer('workspace.created')
  async handleEvent(
    msg: MessageEnvelope<OutboxMessage<WorkspaceCreatedPayload>>,
    ack: () => Promise<void>,
  ): Promise<void> {
    this.logger.log(`Received workspace.created event for workspace: ${msg.data.payload.id}`);

      await this.commandBus.execute(
        new CreateDefaultPrioritySchemesCommand(msg.data.payload.id),
      );

      this.logger.log(`Successfully created default priority schemes for workspace: ${msg.data.payload.id}`);
      await ack();
  }
}
