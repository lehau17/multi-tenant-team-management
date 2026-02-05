import { DomainException, ERROR_CODE } from '@app/shared';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EMAIL_SENDER_PORT,
  IEmailSenderPort,
  TEmailSendResult,
} from '../../domain/port/email-sender.port';
import {
  INotificationTemplateRepositoryPort,
  NOTIFICATION_TEMPLATE_REPOSITORY_PORT,
} from '../../domain/port/notification-template.repository.port';
import { SendEmailCommand } from './send-email.command';

@CommandHandler(SendEmailCommand)
export class SendEmailCommandHandler implements ICommandHandler<SendEmailCommand> {
  private readonly DEFAULT_LANGUAGE = 'vi';

  constructor(
    @Inject(NOTIFICATION_TEMPLATE_REPOSITORY_PORT)
    private readonly templateRepository: INotificationTemplateRepositoryPort,
    @Inject(EMAIL_SENDER_PORT)
    private readonly emailSender: IEmailSenderPort,
  ) {}

  async execute(command: SendEmailCommand): Promise<TEmailSendResult> {
    const { templateCode, to, data, language, cc, bcc } = command;

    // 1. Lấy template theo code
    const template = await this.templateRepository.findByCode(templateCode);
    if (!template) {
      throw new DomainException(
        ERROR_CODE.INVALID_TEMPLATE_CODE,
        `Template with code '${templateCode}' not found`,
      );
    }

    // 2. Lấy translation theo language (hoặc fallback về default)
    const requestedLanguage = language || this.DEFAULT_LANGUAGE;
    const translation = template.getTranslationOrDefault(
      requestedLanguage,
      this.DEFAULT_LANGUAGE,
    );

    if (!translation) {
      throw new DomainException(
        ERROR_CODE.TEMPLATE_TRANSLATION_NOT_FOUND,
        `No translation found for template '${templateCode}'`,
      );
    }

    // 3. Render content với data
    const rendered = translation.render(data);

    // 4. Gửi mail
    return this.emailSender.send({
      to,
      cc,
      bcc,
      subject: rendered.subject!,
      body: rendered.body,
      isHtml: true,
    });
  }
}
