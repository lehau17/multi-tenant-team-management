import { NotificationTemplateCode } from '@app/shared';

export class SendEmailCommand {
  constructor(
    public readonly templateCode: NotificationTemplateCode,
    public readonly to: string | string[],
    public readonly data: Record<string, string>,
    public readonly language?: string,
    public readonly cc?: string | string[],
    public readonly bcc?: string | string[],
  ) {}
}
