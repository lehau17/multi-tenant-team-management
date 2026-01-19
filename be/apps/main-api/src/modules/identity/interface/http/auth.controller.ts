import { BaseResponse } from "@app/shared/core/base-response.base";
import { Public } from "@app/shared/decorator/public.decorator";
import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LoginUserCommand } from "../../application/command/login.command";
import { RegisterUserCommand } from "../../application/command/register.command";
import { UserRequestDto } from "../dto/request/create-user.request";
import { LoginRequestDtp } from "../dto/request/login.request";

@Public()
@Controller("/v1/auth")
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus : QueryBus
  ) {

  }

  @Post("register")
  async create(@Body() dto: UserRequestDto) {
    const command = new RegisterUserCommand(dto.fullname,dto.email, dto.password);

    const result = await this.commandBus.execute(command);
    return BaseResponse.created(result)
  }

    @Post("login")
  async login(@Body() dto: LoginRequestDtp) {
    const command = new LoginUserCommand(dto.email, dto.password);

    const result = await this.commandBus.execute(command);
    return BaseResponse.ok(result)
  }


}
