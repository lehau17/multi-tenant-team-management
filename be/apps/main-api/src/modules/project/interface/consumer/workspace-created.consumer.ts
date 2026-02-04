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
    msg: OutboxMessage<WorkspaceCreatedPayload>,
    ack: () => Promise<void>,
  ): Promise<void> {
    this.logger.log(`Received workspace.created event for workspace: ${msg.payload.id}`);

    try {
      await this.commandBus.execute(
        new CreateDefaultPrioritySchemesCommand(msg.payload.id),
      );

      this.logger.log(`Successfully created default priority schemes for workspace: ${msg.payload.id}`);
      await ack();
    } catch (error) {
      this.logger.error(
        `Failed to create default priority schemes for workspace: ${msg.payload.id}`,
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }
}
