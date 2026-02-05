import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  IEmailSenderPort,
  TEmailMessage,
  TEmailSendResult,
} from '../../../domain/port/email-sender.port';

export class GmailSmtpAdapter implements IEmailSenderPort {
  private readonly logger = new Logger(GmailSmtpAdapter.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async send(message: TEmailMessage): Promise<TEmailSendResult> {
    const mailOptions = this.buildMailOptions(message);
    const info = await this.transporter.sendMail(mailOptions);

    this.logger.log(`Email sent successfully: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  }

  async sendBatch(messages: TEmailMessage[]): Promise<TEmailSendResult[]> {
    return Promise.all(messages.map(message => this.send(message)));
  }

  private buildMailOptions(message: TEmailMessage): nodemailer.SendMailOptions {
    const fromEmail = this.configService.get<string>('GMAIL_USER');
    const fromName = this.configService.get<string>('GMAIL_FROM_NAME', 'Notification Service');

    return {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(message.to) ? message.to.join(', ') : message.to,
      cc: message.cc ? (Array.isArray(message.cc) ? message.cc.join(', ') : message.cc) : undefined,
      bcc: message.bcc ? (Array.isArray(message.bcc) ? message.bcc.join(', ') : message.bcc) : undefined,
      subject: message.subject,
      [message.isHtml ? 'html' : 'text']: message.body,
      attachments: message.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    };
  }

  async verifyConnection(): Promise<boolean> {
    await this.transporter.verify();
    this.logger.log('SMTP connection verified successfully');
    return true;
  }
}
