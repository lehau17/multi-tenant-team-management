import { Pagination } from "@app/shared/core/base-response.base";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProjectsByWorkspace } from "../../domain/dtos/project.props";
import { IPROJECT_REPOSITORY, IProjectRepository } from "../../domain/ports/project.repository.port";
import { ProjectResponseDto } from "../dto/project.dto";
import { ProjectApplicationMapper } from "../mapper/project.mapper";
import { ProjectByWorkspaceQuery } from "./project-by-workspace.query";

@QueryHandler(ProjectByWorkspaceQuery)
export class ProjectByWorkspaceQueryHandler implements IQueryHandler<ProjectByWorkspaceQuery> {
  constructor(
    @Inject(IPROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(query: ProjectByWorkspaceQuery): Promise<Pagination<ProjectResponseDto>> {
    const { workspaceId, limit, page, sortOrder } = query;

    const { total, data } = await this.projectRepository.getProjectsByWorkspace(
      new GetProjectsByWorkspace(workspaceId, { limit, page, sortOrder }),
    );

    const dataResponse = data.map(ProjectApplicationMapper.toDtoResponse);

    return new Pagination<ProjectResponseDto>(dataResponse, total, query);
  }
}
