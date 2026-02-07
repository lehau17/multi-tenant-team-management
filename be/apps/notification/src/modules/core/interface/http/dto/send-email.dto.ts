import { NotificationTemplateCode } from '@app/shared';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsEnum(NotificationTemplateCode)
  templateCode: NotificationTemplateCode;

  @IsNotEmpty()
  to: string | string[];

  @IsObject()
  data: Record<string, string>;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  cc?: string | string[];

  @IsOptional()
  bcc?: string | string[];
}
