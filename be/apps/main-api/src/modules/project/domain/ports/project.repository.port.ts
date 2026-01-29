import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { Project } from "../entity/project.entity";
import { GetProjectsByWorkspace } from "../dtos/project.props";

export const IPROJECT_REPOSITORY = Symbol("IProjectRepository");

export interface IProjectRepository {
  createProject(project: Project): Promise<void>;
  existProjectIdentifier(workspaceId: string, identifier: string): Promise<boolean>;
  getProjectsByWorkspace(query: GetProjectsByWorkspace): Promise<BasePaginationQueryResponse<Project[]>>;
}
