import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginUserCommand } from '../../application/command/login.command';
import { RegisterUserCommand } from '../../application/command/register.command';

interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Controller()
export class AuthGrpcController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterRequest) {
    const command = new RegisterUserCommand(data.fullname, data.email, data.password);
    const result = await this.commandBus.execute(command);
    return { id: result.id };
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest) {
    const command = new LoginUserCommand(data.email, data.password);
    const result = await this.commandBus.execute(command);
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        fullname: result.user.fullname,
      },
      tokens: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }
}
