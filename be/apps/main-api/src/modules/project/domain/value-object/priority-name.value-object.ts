import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IPriorityNameProps {
  value: string;
}

export class PriorityNameVo extends ValueObject<IPriorityNameProps> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 50;

  private constructor(props: IPriorityNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(name: string): PriorityNameVo {
    if (!name || name.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Priority name cannot be empty');
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Priority name must be at least ${this.MIN_LENGTH} characters`);
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Priority name cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return new PriorityNameVo({ value: trimmed });
  }
}
