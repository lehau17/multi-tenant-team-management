import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateWorkspaceDto {

  @IsNotEmpty({ message: 'Tên workspace không được để trống' })
  @IsString()
  @MinLength(3, { message: 'Tên workspace phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Tên workspace không được quá 50 ký tự' })
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Logo phải là một đường dẫn URL hợp lệ' })
  logo?: string;


}
