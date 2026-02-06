import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IStageNameProps {
  value: string;
}

export class StageNameVo extends ValueObject<IStageNameProps> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  private constructor(props: IStageNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(name: string): StageNameVo {
    if (!name || name.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Stage name cannot be empty');
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Stage name must be at least ${this.MIN_LENGTH} characters`);
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Stage name cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return new StageNameVo({ value: trimmed });
  }
}
