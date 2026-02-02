import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";
import { TPlanConfig } from "../dtos/plan.dto";

export class PlanConfigVo extends ValueObject<TPlanConfig> {
  private constructor(props: TPlanConfig) {
    super(props);
  }

  get maxMembers(): number {
    return this.props.max_members;
  }

  get maxProjects(): number {
    return this.props.max_projects;
  }

  static create(config: TPlanConfig): PlanConfigVo {
    if (config.max_members < -1) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_CONFIG, "max_members phải >= -1 (-1 = unlimited)");
    }
    if (config.max_projects < -1) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_CONFIG, "max_projects phải >= -1 (-1 = unlimited)");
    }
    return new PlanConfigVo({
      max_members: config.max_members,
      max_projects: config.max_projects,
    });
  }

  static load(config: TPlanConfig): PlanConfigVo {
    return new PlanConfigVo(config);
  }

  toJSON(): TPlanConfig {
    return {
      max_members: this.props.max_members,
      max_projects: this.props.max_projects,
    };
  }
}
