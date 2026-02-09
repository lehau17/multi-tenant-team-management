import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProjectCommandHandler } from './application/command/create-project/create-project.handler';
import { CreateDefaultPrioritySchemesHandler } from './application/command/create-default-priority-schemes/create-default-priority-schemes.handler';
import { ProjectByWorkspaceQueryHandler } from './application/query/project-by-workspace.handler';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { WorkspaceCreatedConsumer } from './interface/consumer/workspace-created.consumer';
import { ProjectController } from './interface/http/project.controller';
import { TaskController } from './interface/http/task.controller';
import { CreateTaskCommandHandler } from './application/command/create-task/create-task.handler';

import { ITASK_REPOSITORY } from './domain/ports/task.repository';
import { TaskRepository } from './infrastructure/adapter/task.repository';

import { StageController } from './interface/http/stage.controller';
import { GetStagesByWorkspaceHandler } from './application/query/get-stages-by-workspace/get-stages-by-workspace.handler';
import { GetTasksByStageHandler } from './application/query/get-tasks-by-stage/get-tasks-by-stage.handler';

@Module({
  imports: [InfrastructureModule, CqrsModule],
  providers: [
    CreateProjectCommandHandler,
    CreateDefaultPrioritySchemesHandler,
    ProjectByWorkspaceQueryHandler,
    CreateTaskCommandHandler,
    GetStagesByWorkspaceHandler,
    GetTasksByStageHandler,
    {
      provide: ITASK_REPOSITORY,
      useClass: TaskRepository,
    },
  ],
  controllers: [ProjectController, WorkspaceCreatedConsumer, TaskController, StageController],
})
export class ProjectModule { }
