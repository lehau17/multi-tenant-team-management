import { Plan } from "../../domain/entity/plan.entity";
import { PlanResponseDto } from "../dto/plan.dto";

export class PlanApplicationMapper {
  static toDtoResponse(plan: Plan): PlanResponseDto {
    return new PlanResponseDto(
      plan.id,
      plan.name,
      plan.code,
      plan.description,
      plan.price,
      plan.currency,
      plan.config,
      plan.isActive,
    );
  }
}
