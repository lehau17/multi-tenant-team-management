import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IPriorityScoreProps {
  value: number;
}

export class PriorityScoreVo extends ValueObject<IPriorityScoreProps> {
  private static readonly MIN_SCORE = 0;
  private static readonly MAX_SCORE = 100;

  private constructor(props: IPriorityScoreProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  static create(score: number): PriorityScoreVo {
    if (typeof score !== 'number' || isNaN(score)) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Priority score must be a valid number');
    }

    if (!Number.isInteger(score)) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Priority score must be an integer');
    }

    if (score < this.MIN_SCORE || score > this.MAX_SCORE) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Priority score must be between ${this.MIN_SCORE} and ${this.MAX_SCORE}`);
    }

    return new PriorityScoreVo({ value: score });
  }
}
