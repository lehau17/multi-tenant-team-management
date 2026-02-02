import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface IPlanNameProps {
  value: string;
}

export class PlanNameVo extends ValueObject<IPlanNameProps> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  private constructor(props: IPlanNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(name: string): PlanNameVo {
    if (!name || name.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_NAME, "Tên plan không được để trống");
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_NAME, `Tên plan phải có ít nhất ${this.MIN_LENGTH} ký tự`);
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_NAME, `Tên plan không được vượt quá ${this.MAX_LENGTH} ký tự`);
    }

    return new PlanNameVo({ value: trimmed });
  }
}
