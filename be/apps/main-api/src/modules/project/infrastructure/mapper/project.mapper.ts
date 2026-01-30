import { Project } from "../../domain/entity/project.entity";
import { ProjectOrmEntity } from "../persistence/project.orm-entity";

export class ProjectMapper {
  static toDomain(data: ProjectOrmEntity): Project {
    return Project.create(
      {
        name: data.name,
        identifier: data.identifier,
        workspaceId: data.workspaceId,
      },
      data.id,
    );
  }
}
