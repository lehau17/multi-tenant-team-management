import { ValueObject } from "@app/shared/core";
import { DomainException } from "@app/shared/error/error-exception";

export interface IIdentifierProjectProps {
  value: string;
}

export class IdentifierProjectVo extends ValueObject<IIdentifierProjectProps> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 12;
  private static readonly IDENTIFIER_REGEX = /^[A-Z][A-Z0-9_-]*$/;

  private constructor(props: IIdentifierProjectProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(identifier: string): IdentifierProjectVo {
    if (!identifier || identifier.trim().length === 0) {
      throw new DomainException("Identifier project không được để trống");
    }

    const normalized = identifier.trim().toUpperCase();

    if (normalized.length < this.MIN_LENGTH) {
      throw new DomainException(`Identifier phải có ít nhất ${this.MIN_LENGTH} ký tự`);
    }

    if (normalized.length > this.MAX_LENGTH) {
      throw new DomainException(`Identifier không được vượt quá ${this.MAX_LENGTH} ký tự`);
    }

    if (!this.IDENTIFIER_REGEX.test(normalized)) {
      throw new DomainException("Identifier chỉ được chứa chữ cái in hoa, số, dấu gạch ngang và gạch dưới, bắt đầu bằng chữ cái");
    }

    return new IdentifierProjectVo({ value: normalized });
  }
}
