import { ICommand } from "@nestjs/cqrs";

export class TogglePlanStatusCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly isActive: boolean,
  ) {}
}
