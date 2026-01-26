import { Workspace } from "../../domain/entity/workspace.entity";
import { WorkspaceResponseDto } from "../dto/workspace.dto";

export class WorkspaceApplicationMapper {
  static toDtoResponse(workspace: Workspace): WorkspaceResponseDto{
    return new WorkspaceResponseDto(workspace.id, workspace.workspaceName, workspace.workspaceLogo, workspace.workspaceSlug)
  }
}
