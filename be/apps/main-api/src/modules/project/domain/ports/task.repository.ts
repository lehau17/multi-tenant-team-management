import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { GetTasksByStageQuery } from "../../application/query/get-tasks-by-stage/get-tasks-by-stage.query";
import { TaskEntity } from "../entity/task.entity";

export interface ITaskRepository {
    createTask(task: TaskEntity): Promise<TaskEntity>;
    getTasksByStage(query: GetTasksByStageQuery): Promise<BasePaginationQueryResponse<TaskEntity[]>>;
}

export const ITASK_REPOSITORY = "ITASK_REPOSITORY";