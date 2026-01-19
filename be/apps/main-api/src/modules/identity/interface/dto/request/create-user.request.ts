import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserRequestDto {
  @IsString()
    @IsNotEmpty()
  fullname: string
  @IsString()
    @IsNotEmpty()
  password: string
  @IsEmail()
    @IsNotEmpty()
  email :string
}
