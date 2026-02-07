import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IPriorityIconProps {
  value: string;
}

export class PriorityIconVo extends ValueObject<IPriorityIconProps> {
  private static readonly MAX_LENGTH = 100;

  private constructor(props: IPriorityIconProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(icon: string): PriorityIconVo {
    if (!icon || icon.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Priority icon cannot be empty');
    }

    const trimmed = icon.trim();

    if (trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Priority icon cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return new PriorityIconVo({ value: trimmed });
  }
}
