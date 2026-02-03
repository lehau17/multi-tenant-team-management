import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PlanSeedService } from "../../../infrastructure/seed/plan.seed";
import { SeedPlansCommand } from "./seed-plans.command";

@CommandHandler(SeedPlansCommand)
export class SeedPlansCommandHandler
  implements ICommandHandler<SeedPlansCommand>
{
  constructor(private readonly planSeedService: PlanSeedService) {}

  async execute(): Promise<number> {
    return this.planSeedService.seed();
  }
}
