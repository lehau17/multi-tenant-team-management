import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'Workspace ID không được để trống' })
  @IsUUID('all', { message: 'Workspace ID phải là UUID hợp lệ' })
  workspaceId: string;

  @IsNotEmpty({ message: 'Tên project không được để trống' })
  @IsString()
  @MinLength(2, { message: 'Tên project phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Tên project không được quá 100 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Identifier không được để trống' })
  @IsString()
  @MinLength(1, { message: 'Identifier phải có ít nhất 1 ký tự' })
  @MaxLength(12, { message: 'Identifier không được quá 12 ký tự' })
  identifier: string;
}
