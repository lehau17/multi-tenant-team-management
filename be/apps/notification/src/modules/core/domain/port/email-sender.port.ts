export type TEmailMessage = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  attachments?: TEmailAttachment[];
}

export type TEmailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export type TEmailSendResult = {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const EMAIL_SENDER_PORT = Symbol('EMAIL_SENDER_PORT');

export interface IEmailSenderPort {
  send(message: TEmailMessage): Promise<TEmailSendResult>;
  sendBatch(messages: TEmailMessage[]): Promise<TEmailSendResult[]>;
}
