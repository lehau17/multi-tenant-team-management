import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProjectCommandHandler } from './application/command/create-project/create-project.handler';
import { CreateDefaultPrioritySchemesHandler } from './application/command/create-default-priority-schemes/create-default-priority-schemes.handler';
import { ProjectByWorkspaceQueryHandler } from './application/query/project-by-workspace.handler';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { WorkspaceCreatedConsumer } from './interface/consumer/workspace-created.consumer';
import { ProjectController } from './interface/http/project.controller';

@Module({
  imports: [InfrastructureModule, CqrsModule],
  providers: [
    CreateProjectCommandHandler,
    CreateDefaultPrioritySchemesHandler,
    ProjectByWorkspaceQueryHandler,
  ],
  controllers: [ProjectController, WorkspaceCreatedConsumer],
})
export class ProjectModule {}
