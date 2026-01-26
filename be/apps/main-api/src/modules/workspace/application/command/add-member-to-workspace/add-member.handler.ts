import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WorkspaceMember } from "../../../domain/entity/workspace-member.entity";
import { IWORKSPACE_MEMBER, IWorkspaceMemberRepository } from "../../../domain/ports/workspace-member.repository";
import { AddMemberToWorkspaceCommand } from "./add-member.command";


@CommandHandler(AddMemberToWorkspaceCommand)
export class AddMemberToWorkspaceHandler implements ICommandHandler<AddMemberToWorkspaceCommand> {
  constructor(
    @Inject(IWORKSPACE_MEMBER)
    private readonly workspaceMemberRepositoruy : IWorkspaceMemberRepository
  ) {

  }

  async execute(command: AddMemberToWorkspaceCommand): Promise<boolean> {
    const isExistMember = await this.workspaceMemberRepositoruy.checkMemberAlreadyExist(command.toUserId)
    if (isExistMember) throw new BadRequestException(ERROR_CODE.MEMBER_ALREADDY_INVITED)
    const workspaceMember = WorkspaceMember.create({
      toUserId: command.toUserId,
      fromUserId: command.fromUserId,
      workspaceId: command.workspaceId
    })
    // TODO : logic send invited to user
    await this.workspaceMemberRepositoruy.addMemberToWorkspace(workspaceMember)
    return true

  }
}
