import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskEntity } from "../../domain/entity/task.entity";
import { ITaskRepository } from "../../domain/ports/task.repository";
import { TaskOrmEntity } from "../persistence/task.orm-entity";
import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { GetTasksByStageQuery } from "../../application/query/get-tasks-by-stage/get-tasks-by-stage.query";
import { TaskMapper } from "../mapper/task.mapper";

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(TaskOrmEntity)
        private readonly taskRepository: Repository<TaskOrmEntity>,
    ) { }

    async createTask(task: TaskEntity): Promise<TaskEntity> {
        const ormEntity = this.taskRepository.create({
            id: task.id,
            title: task.title,
            description: task.description,
            taskNumber: task.taskNumber,
            position: task.position,
            assignId: task.assignId,
            stage: { id: task.stageId },
            project: { id: task.projectId },
            priority: { id: task.priorityId },
        });

        await this.taskRepository.save(ormEntity);

        return task;
    }

    async getTasksByStage(query: GetTasksByStageQuery): Promise<BasePaginationQueryResponse<TaskEntity[]>> {
        const [data, total] = await this.taskRepository.findAndCount({
            where: {
                stage: { id: query.stageId },
            },
            relations: ['stage', 'project', 'priority'],
            skip: query.skip,
            take: query.limit,
            order: {
                position: 'ASC',
            },
        });

        const dataResponse = data.map((e) => TaskMapper.toDomain(e));

        return {
            data: dataResponse,
            total,
        };
    }
}
