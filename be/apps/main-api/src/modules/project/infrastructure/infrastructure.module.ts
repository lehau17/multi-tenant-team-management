import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IPROJECT_REPOSITORY } from "../domain/ports/project.repository.port";
import { IPRIORITY_SCHEME_REPOSITORY } from "../domain/ports/priority-scheme.repository.port";
import { ProjectRepository } from "./adapter/project.repository";
import { PrioritySchemeRepository } from "./adapter/priority-scheme.repository";
import { ProjectOrmEntity } from "./persistence/project.orm-entity";
import { PrioritySchemeOrmEntity } from "./persistence/priority-scheme.orm-entity";
import { PriorityOrmEntity } from "./persistence/priority.orm-entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectOrmEntity,
      PrioritySchemeOrmEntity,
      PriorityOrmEntity,
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
  ],
  exports: [IPROJECT_REPOSITORY, IPRIORITY_SCHEME_REPOSITORY],
})
export class InfrastructureModule {}
