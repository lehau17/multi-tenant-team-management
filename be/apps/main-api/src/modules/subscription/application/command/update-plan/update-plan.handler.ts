import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  IPLAN_REPOSITORY,
  IPlanRepository,
} from "../../../domain/ports/plan.repository.port";
import { UpdatePlanCommand } from "./update-plan.command";

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanCommandHandler
  implements ICommandHandler<UpdatePlanCommand>
{
  constructor(
    @Inject(IPLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(command: UpdatePlanCommand): Promise<void> {
    const plan = await this.planRepository.findById(command.planId);
    if (!plan) {
      throw new BadRequestException(ERROR_CODE.PLAN_NOT_FOUND);
    }

    plan.updateInfo({
      name: command.name,
      description: command.description,
      price: command.price,
      currency: command.currency,
    });

    if (command.config) {
      plan.updateConfig(command.config);
    }

    await this.planRepository.save(plan);
  }
}
