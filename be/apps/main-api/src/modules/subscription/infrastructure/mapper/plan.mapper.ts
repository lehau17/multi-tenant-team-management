import { PlanCodeVo } from "../../domain/value-objects/plan-code.value-object";
import { PlanConfigVo } from "../../domain/value-objects/plan-config.value-object";
import { PlanNameVo } from "../../domain/value-objects/plan-name.value-object";
import { PlanPriceVo } from "../../domain/value-objects/plan-price.value-object";
import { Plan } from "../../domain/entity/plan.entity";
import { PlanOrmEntity } from "../persistence/plan.orm-entity";

export class PlanInfraMapper {
  static toDomain(orm: PlanOrmEntity): Plan {
    return new Plan(orm.id, {
      name: PlanNameVo.create(orm.name),
      code: PlanCodeVo.create(orm.code),
      description: orm.description,
      price: PlanPriceVo.create(Number(orm.price), orm.currency),
      config: PlanConfigVo.load(orm.config),
      isActive: orm.isActive,
    });
  }

  static toPersistence(plan: Plan): Partial<PlanOrmEntity> {
    return {
      id: plan.id,
      name: plan.name,
      code: plan.code,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      config: plan.config,
      isActive: plan.isActive,
    };
  }
}
