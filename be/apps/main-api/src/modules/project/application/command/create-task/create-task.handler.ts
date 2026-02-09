import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Transactional } from "typeorm-transactional";
import { TaskEntity } from "../../../domain/entity/task.entity";
import { IPROJECT_REPOSITORY, IProjectRepository } from "../../../domain/ports/project.repository.port";
import { ITASK_REPOSITORY, ITaskRepository } from "../../../domain/ports/task.repository";
import { CreateTaskCommand } from "./create-task.command";

@CommandHandler(CreateTaskCommand)
export class CreateTaskCommandHandler implements ICommandHandler<CreateTaskCommand> {
    constructor(
        @Inject(ITASK_REPOSITORY)
        private readonly taskRepository: ITaskRepository,
        @Inject(IPROJECT_REPOSITORY)
        private readonly projectRepository: IProjectRepository,
    ) { }

    @Transactional()
    async execute(command: CreateTaskCommand): Promise<string> {
        const isValid = await this.projectRepository.validateProjectStagePriority(
            command.projectId,
            command.stageId,
            command.priorityId,
        );

        if (!isValid) {
            throw new BadRequestException(ERROR_CODE.INVALID_DATA_REQUEST, "Invalid project, stage or priority");
        }

        const task = TaskEntity.create({
            title: command.title,
            description: command.description,
            stageId: command.stageId,
            projectId: command.projectId,
            priorityId: command.priorityId,
            taskNumber: command.taskNumber,
            position: command.position,
            assignId: command.assignId,
        });

        await this.taskRepository.createTask(task);

        return task.id;
    }
}
