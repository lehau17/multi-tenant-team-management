import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsNotEmpty()
    stageId: string;

    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsUUID()
    @IsNotEmpty()
    priorityId: string;

    @IsNumber()
    @Min(0)
    taskNumber: number;

    @IsNumber()
    @Min(0)
    position: number;

    @IsUUID()
    @IsOptional()
    assignId?: string;
}
