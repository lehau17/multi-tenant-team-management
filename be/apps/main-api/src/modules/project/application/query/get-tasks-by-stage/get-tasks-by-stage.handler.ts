import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TaskEntity } from "../../../domain/entity/task.entity";
import { ITASK_REPOSITORY, ITaskRepository } from "../../../domain/ports/task.repository";
import { GetTasksByStageQuery } from "./get-tasks-by-stage.query";

@QueryHandler(GetTasksByStageQuery)
export class GetTasksByStageHandler implements IQueryHandler<GetTasksByStageQuery> {
    constructor(
        @Inject(ITASK_REPOSITORY)
        private readonly taskRepository: ITaskRepository,
    ) { }

    async execute(query: GetTasksByStageQuery): Promise<BasePaginationQueryResponse<TaskEntity[]>> {
        return this.taskRepository.getTasksByStage(query);
    }
}
