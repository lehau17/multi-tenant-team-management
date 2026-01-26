import { ICommand } from "@nestjs/cqrs";




export class AddMemberToWorkspaceCommand implements ICommand{
  constructor(
    public readonly workspaceId :string,
    public readonly fromUserId :string,
    public readonly toUserId :string,
  ){}
}
