import { Workspace } from "../../domain/entity/workspace.entity";
import { WorkspaceOrmEntity } from "../persistence/workspace.orm-entity";

export class WorkspaceMapper{
  static toDomain(data: WorkspaceOrmEntity): Workspace{
    return Workspace.create({name : data.workspaceName, ownerId : data.ownerId, logo : data.logoUrl, slug : data.workspaceSlug})
  }
}
