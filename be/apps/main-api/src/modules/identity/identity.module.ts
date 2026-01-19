import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginUserHandler } from './application/command/login.handler';
import { RegisterHandler } from './application/command/register.handler';
import { IdentityDatabaseModule } from './infrastructure/database.module';
import { AuthController } from './interface/http/auth.controller';
@Module({
  imports: [IdentityDatabaseModule, CqrsModule],
  controllers: [AuthController],
  providers: [

    RegisterHandler,
    LoginUserHandler
  ]
}
)
export class IdentityModule{ }
