import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  IPLAN_REPOSITORY,
  IPlanRepository,
} from "../../../domain/ports/plan.repository.port";
import { PlanResponseDto } from "../../dto/plan.dto";
import { PlanApplicationMapper } from "../../mapper/plan.mapper";
import { GetPlansQuery } from "./get-plans.query";

@QueryHandler(GetPlansQuery)
export class GetPlansQueryHandler implements IQueryHandler<GetPlansQuery> {
  constructor(
    @Inject(IPLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(): Promise<PlanResponseDto[]> {
    const plans = await this.planRepository.findAll();
    return plans.map(PlanApplicationMapper.toDtoResponse);
  }
}
