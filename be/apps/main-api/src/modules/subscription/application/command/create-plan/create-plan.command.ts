import { ICommand } from "@nestjs/cqrs";
import { TPlanConfig } from "../../../domain/dtos/plan.dto";

export class CreatePlanCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly price: number,
    public readonly config: TPlanConfig,
    public readonly description?: string,
    public readonly currency?: string,
  ) {}
}
