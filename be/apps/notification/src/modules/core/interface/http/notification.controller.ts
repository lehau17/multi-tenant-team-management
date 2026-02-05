import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailCommand } from '../../application/command/send-email.command';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('email')
  async sendEmail(@Body() dto: SendEmailDto) {
    const command = new SendEmailCommand(
      dto.templateCode,
      dto.to,
      dto.data,
      dto.language,
      dto.cc,
      dto.bcc,
    );

    return this.commandBus.execute(command);
  }
}
