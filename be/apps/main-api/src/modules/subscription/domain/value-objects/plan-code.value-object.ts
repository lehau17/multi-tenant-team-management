import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface IPlanCodeProps {
  value: string;
}

export class PlanCodeVo extends ValueObject<IPlanCodeProps> {
  private static readonly MAX_LENGTH = 50;
  private static readonly CODE_REGEX = /^[a-z0-9_-]+$/;

  private constructor(props: IPlanCodeProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(code: string): PlanCodeVo {
    if (!code || code.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_CODE, "Code plan không được để trống");
    }

    const normalized = code.trim().toLowerCase();

    if (normalized.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_CODE, `Code plan không được vượt quá ${this.MAX_LENGTH} ký tự`);
    }

    if (!this.CODE_REGEX.test(normalized)) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_CODE, "Code plan chỉ được chứa chữ thường, số, gạch ngang và gạch dưới");
    }

    return new PlanCodeVo({ value: normalized });
  }
}
