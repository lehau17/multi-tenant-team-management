import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IPriorityColorProps {
  value: string;
}

export class PriorityColorVo extends ValueObject<IPriorityColorProps> {
  private static readonly HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  private constructor(props: IPriorityColorProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(color: string): PriorityColorVo {
    if (!color || color.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Priority color cannot be empty');
    }

    const trimmed = color.trim();

    if (!this.HEX_COLOR_REGEX.test(trimmed)) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Priority color must be a valid hex color (e.g., #FF5733)');
    }

    return new PriorityColorVo({ value: trimmed.toUpperCase() });
  }
}
