import { WorkspaceMember } from "../entity/workspace-member.entity"

export const IWORKSPACE_MEMBER = Symbol("IWorkspaceMember")


export interface IWorkspaceMemberRepository {
  addMemberToWorkspace(workspaceMember: WorkspaceMember): Promise<void>
  checkMemberAlreadyExist(userId :string) : Promise<boolean>
}
