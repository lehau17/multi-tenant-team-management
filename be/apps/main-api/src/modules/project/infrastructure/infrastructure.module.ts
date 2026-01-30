import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IPROJECT_REPOSITORY } from "../domain/ports/project.repository.port";
import { ProjectRepository } from "./adapter/project.repository";
import { ProjectOrmEntity } from "./persistence/project.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectOrmEntity])],
  providers: [
    {
      useClass: ProjectRepository,
      provide: IPROJECT_REPOSITORY,
    },
  ],
  exports: [IPROJECT_REPOSITORY],
})
export class InfrastructureModule {}
