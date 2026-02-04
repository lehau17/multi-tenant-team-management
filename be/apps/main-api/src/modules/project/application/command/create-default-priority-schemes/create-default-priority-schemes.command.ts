import { ICommand } from '@nestjs/cqrs';

export class CreateDefaultPrioritySchemesCommand implements ICommand {
  constructor(public readonly workspaceId: string) {}
}
