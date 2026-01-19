import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { uuidv7 } from "uuidv7";
import { User } from "../../domain/entity/user.entity";
import { IPasswordHaser, PASSWORD_HASHER } from "../../domain/port/password-hasher.port";
import { IUserRepository, USER_REPOSITORY } from "../../domain/port/user.repository";
import { RegisterUserCommand } from "./register.command";
@CommandHandler(RegisterUserCommand)
export class RegisterHandler implements ICommandHandler<RegisterUserCommand>{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHaser  : IPasswordHaser
  ){}
  async execute(command: RegisterUserCommand): Promise<{ id: string }> {
    // find user by email
    const foundUser = await this.userRepo.findByEmail(command.email)
    console.log("Check. user", foundUser)
    if (foundUser) {
      throw new BadRequestException(ERROR_CODE.EMAIL_ALREADY_EXIST)
    }
    const userId = uuidv7()
    const salt = await this.passwordHaser.salt()
    const password = await this.passwordHaser.hash(command.password, salt)
    const user =  User.create(userId, {
      passwordHash : password,
      email : command.email,
      fullname: command.fullname,
      salt
    })
    console.log("Chekc user diomain", user)
    await this.userRepo.createUser(user)
    return {id : userId}

  }
}
