import { ICommand } from "@nestjs/cqrs";

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly workspaceId: string,
    public readonly name: string,
    public readonly identifier: string,
    public readonly createdBy: string,
  ) {}
}
