import { MessageEnvelope } from '@app/message-queue';
import { OutboxMessage } from '@app/outbox';
import { NotificationTemplateCode, OnEventConsumer } from '@app/shared';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailCommand } from '../../application/command/send-email.command';

export interface SendEmailPayload {
  templateCode: NotificationTemplateCode;
  to: string | string[];
  data: Record<string, string>;
  language?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

@Controller()
export class SendEmailConsumer {
  private readonly logger = new Logger(SendEmailConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @OnEventConsumer('notification.send-email')
  async handleEvent(
    msg: MessageEnvelope<OutboxMessage<SendEmailPayload>>,
    ack: () => Promise<void>,
  ): Promise<void> {
    const { templateCode, to, data, language, cc, bcc } = msg.data.payload;

    this.logger.log(`Received send-email event for template: ${templateCode}`);

    const command = new SendEmailCommand(
      templateCode,
      to,
      data,
      language,
      cc,
      bcc,
    );

    const result = await this.commandBus.execute(command);

    if (result.success) {
      this.logger.log(`Email sent successfully: ${result.messageId}`);
      await ack();
    } else {
      this.logger.error(`Failed to send email: ${result.error}`);
    }
  }
}
