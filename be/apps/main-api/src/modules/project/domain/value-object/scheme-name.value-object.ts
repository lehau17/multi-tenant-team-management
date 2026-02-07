import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface ISchemeNameProps {
  value: string;
}

export class SchemeNameVo extends ValueObject<ISchemeNameProps> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(props: ISchemeNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(name: string): SchemeNameVo {
    if (!name || name.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Scheme name cannot be empty');
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Scheme name must be at least ${this.MIN_LENGTH} characters`);
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Scheme name cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return new SchemeNameVo({ value: trimmed });
  }
}
