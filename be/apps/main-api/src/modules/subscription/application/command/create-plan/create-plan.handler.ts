import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Plan } from "../../../domain/entity/plan.entity";
import {
  IPLAN_REPOSITORY,
  IPlanRepository,
} from "../../../domain/ports/plan.repository.port";
import { CreatePlanCommand } from "./create-plan.command";

@CommandHandler(CreatePlanCommand)
export class CreatePlanCommandHandler
  implements ICommandHandler<CreatePlanCommand>
{
  constructor(
    @Inject(IPLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(command: CreatePlanCommand): Promise<string> {
    const exists = await this.planRepository.existByCode(
      command.code.toLowerCase(),
    );
    if (exists) {
      throw new BadRequestException(ERROR_CODE.PLAN_CODE_ALREADY_EXIST);
    }

    const plan = Plan.create({
      name: command.name,
      code: command.code,
      description: command.description,
      price: command.price,
      currency: command.currency,
      config: command.config,
    });

    await this.planRepository.save(plan);
    return plan.id;
  }
}
