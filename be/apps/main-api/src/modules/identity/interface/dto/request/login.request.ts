import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginRequestDtp {
  @IsEmail()
    @IsNotEmpty()
  email: string
  @IsString()
      @MinLength(6)
    @IsNotEmpty()
  password :string
}
