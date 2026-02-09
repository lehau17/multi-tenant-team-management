import { BaseResponse, PaginationResponse } from "@app/shared/core/base-response.base";
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateTaskCommand } from "../../application/command/create-task/create-task.command";
import { CreateTaskDto } from "../dto/create-task.dto";
import { GetTasksByStageQuery } from "../../application/query/get-tasks-by-stage/get-tasks-by-stage.query";

@Controller("/v1/tasks")
export class TaskController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    async createTask(@Body() payload: CreateTaskDto) {
        const command = new CreateTaskCommand(
            payload.title,
            payload.stageId,
            payload.projectId,
            payload.priorityId,
            payload.taskNumber,
            payload.position,
            payload.description,
            payload.assignId,
        );

        const id = await this.commandBus.execute<CreateTaskCommand>(command);
        return BaseResponse.created({ id });
    }

    @Get("/stage/:stageId")
    async getTasksByStage(
        @Param("stageId", ParseUUIDPipe) stageId: string,
        @Query("page") page?: number,
        @Query("limit") limit?: number,
    ) {
        const query = new GetTasksByStageQuery(stageId, { page, limit });
        const result = await this.queryBus.execute(query);
        return PaginationResponse.fromPagination(result);
    }
}
