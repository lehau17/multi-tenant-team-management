import { Project } from "../../domain/entity/project.entity";
import { ProjectResponseDto } from "../dto/project.dto";

export class ProjectApplicationMapper {
  static toDtoResponse(project: Project): ProjectResponseDto {
    return new ProjectResponseDto(
      project.id,
      project.name,
      project.identifier,
      project.workspaceId,
    );
  }
}
