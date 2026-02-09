import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetProjectsByWorkspace } from "../../domain/dtos/project.props";
import { Project } from "../../domain/entity/project.entity";
import { IProjectRepository } from "../../domain/ports/project.repository.port";
import { ProjectMapper } from "../mapper/project.mapper";
import { ProjectOrmEntity } from "../persistence/project.orm-entity";

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly projectRepository: Repository<ProjectOrmEntity>,
  ) { }

  async createProject(project: Project): Promise<void> {
    const ormEntity = this.projectRepository.create({
      id: project.id,
      name: project.name,
      identifier: project.identifier,
      workspaceId: project.workspaceId,
      createdBy: project.createdBy,
    });

    await this.projectRepository.save(ormEntity);
  }

  async existProjectIdentifier(workspaceId: string, identifier: string): Promise<boolean> {
    return await this.projectRepository.exists({
      where: {
        workspaceId,
        identifier,
      },
    });
  }

  async getProjectsByWorkspace(query: GetProjectsByWorkspace): Promise<BasePaginationQueryResponse<Project[]>> {
    const [data, total] = await this.projectRepository.findAndCount({
      where: {
        workspaceId: query.workspaceId,
      },
      skip: query.skip,
      take: query.limit,
      order: {
        createdAt: query.sortOrder,
      },
    });

    const dataResponse = data.map((e) => ProjectMapper.toDomain(e));

    return {
      data: dataResponse,
      total,
    };
  }

  async validateProjectStagePriority(projectId: string, stageId: string, priorityId: string): Promise<boolean> {
    const query = this.projectRepository.createQueryBuilder("project")
      .innerJoin("project.stageProjects", "stage")
      .innerJoin("priority_schemes", "scheme", "scheme.workspace_id = project.workspace_id")
      .innerJoin("priorities", "priority", "priority.scheme_id = scheme.id")
      .where("project.id = :projectId", { projectId })
      .andWhere("stage.id = :stageId", { stageId })
      .andWhere("priority.id = :priorityId", { priorityId });

    return await query.getExists();
  }
}
