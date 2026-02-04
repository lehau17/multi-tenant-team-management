import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  IPLAN_REPOSITORY,
  IPlanRepository,
} from "../../../domain/ports/plan.repository.port";
import { TogglePlanStatusCommand } from "./toggle-plan-status.command";

@CommandHandler(TogglePlanStatusCommand)
export class TogglePlanStatusCommandHandler
  implements ICommandHandler<TogglePlanStatusCommand>
{
  constructor(
    @Inject(IPLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(command: TogglePlanStatusCommand): Promise<void> {
    const plan = await this.planRepository.findById(command.planId);
    if (!plan) {
      throw new BadRequestException(ERROR_CODE.PLAN_NOT_FOUND);
    }

    if (command.isActive) {
      plan.activate();
    } else {
      plan.deactivate();
    }

    await this.planRepository.save(plan);
  }
}
