
import { ERROR_CODE } from '@app/shared/error/error-code';
import { BadRequestException } from '@app/shared/error/error-exception';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IPasswordHaser, PASSWORD_HASHER } from '../../domain/port/password-hasher.port';
import { ITokenService, TOKEN_SERVICE } from '../../domain/port/token.service';
import { IUserRepository, USER_REPOSITORY } from '../../domain/port/user.repository';
import { LoginUserCommand } from './login.command';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand>{
  constructor(
        @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHaser: IPasswordHaser,
        @Inject(TOKEN_SERVICE) private readonly tokenService : ITokenService
  ){}
 async execute(command: LoginUserCommand): Promise<any> {
   const foundUser = await this.userRepo.findByEmail(command.email)
   if (!foundUser) {
     throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND)
   }
   const isMatched = await this.passwordHaser.compare(command.password, foundUser.password)
   if (!isMatched) {
     throw new BadRequestException(ERROR_CODE.INVALID_CREDENTIALS)
   }
   const tokens =await this.tokenService.generateTokens({ role: "", user_id: foundUser.id })
   return {
     user: {
       id: foundUser.id,
       email: foundUser.email,
       fullname : foundUser.fullname
     },
     tokens
   }

  }

}
