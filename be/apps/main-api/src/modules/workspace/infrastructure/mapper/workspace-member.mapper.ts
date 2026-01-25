import { WorkspaceMember } from "../../domain/entity/workspace-member.entity";
import { WorkspaceMemberOrmEntity } from "../persistence/workspace-memer.orm-entity";

export class WorkspaceMemberMapper {
  static toPersisten(workspaceMember: WorkspaceMember): WorkspaceMemberOrmEntity {
    const workspaceMemberPersistence = new WorkspaceMemberOrmEntity()
    workspaceMemberPersistence.workspaceId = workspaceMember.workspaceId
    workspaceMemberPersistence.fromUserId = workspaceMember.fromUserId
    workspaceMemberPersistence.joinedAt = workspaceMember.joinAt

    return workspaceMemberPersistence
  }
}
