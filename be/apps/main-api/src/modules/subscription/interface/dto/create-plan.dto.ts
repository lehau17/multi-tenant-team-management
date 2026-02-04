import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class PlanConfigDto {
  @IsNumber()
  @Min(-1)
  max_members: number;

  @IsNumber()
  @Min(-1)
  max_projects: number;
}

export class CreatePlanDto {
  @IsNotEmpty({ message: "Tên plan không được để trống" })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: "Code plan không được để trống" })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0, { message: "Giá plan không được âm" })
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ValidateNested()
  @Type(() => PlanConfigDto)
  config: PlanConfigDto;
}
