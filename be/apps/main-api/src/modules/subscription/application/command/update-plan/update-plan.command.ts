import { ICommand } from "@nestjs/cqrs";
import { TPlanConfig } from "../../../domain/dtos/plan.dto";

export class UpdatePlanCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly price?: number,
    public readonly currency?: string,
    public readonly config?: TPlanConfig,
  ) {}
}
