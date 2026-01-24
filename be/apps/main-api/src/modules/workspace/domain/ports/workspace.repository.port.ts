import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { GetMyWorkspace } from "../dtos/workspace.dto";
import { Workspace } from "../entity/workspace.entity";

export const IWORKSPACE_REPOSITORY = Symbol("IWorkspaceRepository")


export interface IWorkspaceRepository {
  getMyWorkspace(query: GetMyWorkspace): Promise<BasePaginationQueryResponse<Workspace[]>>
  existWorkspaceName(workspaceName: string): Promise<boolean>
  createWorkspace(workspace : Workspace) : Promise<void>
}
