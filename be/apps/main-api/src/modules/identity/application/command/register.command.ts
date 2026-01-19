import { ICommand } from '@nestjs/cqrs';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
  ) {
  }
}
