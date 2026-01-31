import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateProjectCommandHandler } from "./application/command/create-project/create-project.handler";
import { ProjectByWorkspaceQueryHandler } from "./application/query/project-by-workspace.handler";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { ProjectController } from "./interface/http/project.controller";

@Module({
  imports: [InfrastructureModule, CqrsModule],
  providers: [CreateProjectCommandHandler, ProjectByWorkspaceQueryHandler],
  controllers: [ProjectController],
})
export class ProjectModule {}
