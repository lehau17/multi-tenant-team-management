import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IPROJECT_REPOSITORY } from "../domain/ports/project.repository.port";
import { IPRIORITY_SCHEME_REPOSITORY } from "../domain/ports/priority-scheme.repository.port";
import { ISTAGE_PROJECT_REPOSITORY } from "../domain/ports/stage-project.repository.port";
import { ProjectRepository } from "./adapter/project.repository";
import { PrioritySchemeRepository } from "./adapter/priority-scheme.repository";
import { StageProjectRepository } from "./adapter/stage-project.repository";
import { ProjectOrmEntity } from "./persistence/project.orm-entity";
import { PrioritySchemeOrmEntity } from "./persistence/priority-scheme.orm-entity";
import { PriorityOrmEntity } from "./persistence/priority.orm-entity";
import { StageProjectOrmEntity } from "./persistence/stage-project.orm-entity";
import { StageProjectTemplateOrmEntity } from "./persistence/stage-project-template.orm-entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectOrmEntity,
      PrioritySchemeOrmEntity,
      PriorityOrmEntity,
      StageProjectOrmEntity,
      StageProjectTemplateOrmEntity,
    ]),
  ],
  providers: [
    {
      useClass: ProjectRepository,
      provide: IPROJECT_REPOSITORY,
    },
    {
      useClass: PrioritySchemeRepository,
      provide: IPRIORITY_SCHEME_REPOSITORY,
    },
    {
      useClass: StageProjectRepository,
      provide: ISTAGE_PROJECT_REPOSITORY,
    },
  ],
  exports: [IPROJECT_REPOSITORY, IPRIORITY_SCHEME_REPOSITORY, ISTAGE_PROJECT_REPOSITORY],
})
export class InfrastructureModule {}
