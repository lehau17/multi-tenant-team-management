import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface INameProjectProps {
  value: string;
}

export class NameProjectVo extends ValueObject<INameProjectProps> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(props: INameProjectProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(name: string): NameProjectVo {
    if (!name || name.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Tên project không được để trống");
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Tên project phải có ít nhất ${this.MIN_LENGTH} ký tự`);
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Tên project không được vượt quá ${this.MAX_LENGTH} ký tự`);
    }

    return new NameProjectVo({ value: trimmed });
  }
}
