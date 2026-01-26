import { ICommand } from "@nestjs/cqrs";

export class CreateWorkspaceCommand implements ICommand {
  constructor(
    public readonly ownerId: string,

    public readonly name: string,
    public readonly logo?: string,

    public readonly slug?: string,
  ){}
}
