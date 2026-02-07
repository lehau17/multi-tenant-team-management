import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailSenderPort } from '../../../domain/port/email-sender.port';
import { GmailSmtpAdapter } from './gmail-smtp.adapter';

export enum EmailProvider {
  GMAIL = 'gmail',
  SENDGRID = 'sendgrid',
  AWS_SES = 'aws_ses',
  MAILGUN = 'mailgun',
}

@Injectable()
export class EmailSenderFactory {
  constructor(private readonly configService: ConfigService) {}

  create(provider?: EmailProvider): IEmailSenderPort {
    const selectedProvider = provider || this.getDefaultProvider();

    switch (selectedProvider) {
      case EmailProvider.GMAIL:
        return new GmailSmtpAdapter(this.configService);

      // Có thể thêm các provider khác ở đây
      // case EmailProvider.SENDGRID:
      //   return new SendGridAdapter(this.configService);
      // case EmailProvider.AWS_SES:
      //   return new AwsSesAdapter(this.configService);

      default:
        return new GmailSmtpAdapter(this.configService);
    }
  }

  private getDefaultProvider(): EmailProvider {
    const provider = this.configService.get<string>('EMAIL_PROVIDER', 'gmail');
    return provider as EmailProvider;
  }
}
