import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  IPLAN_REPOSITORY,
  IPlanRepository,
} from "../../../domain/ports/plan.repository.port";
import { PlanResponseDto } from "../../dto/plan.dto";
import { PlanApplicationMapper } from "../../mapper/plan.mapper";
import { GetPlanByIdQuery } from "./get-plan-by-id.query";

@QueryHandler(GetPlanByIdQuery)
export class GetPlanByIdQueryHandler
  implements IQueryHandler<GetPlanByIdQuery>
{
  constructor(
    @Inject(IPLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(query: GetPlanByIdQuery): Promise<PlanResponseDto> {
    const plan = await this.planRepository.findById(query.planId);
    if (!plan) {
      throw new BadRequestException(ERROR_CODE.PLAN_NOT_FOUND);
    }
    return PlanApplicationMapper.toDtoResponse(plan);
  }
}
