import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IStagePositionProps {
  value: number;
}

export class StagePositionVo extends ValueObject<IStagePositionProps> {
  private constructor(props: IStagePositionProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  static create(position: number): StagePositionVo {
    if (position === null || position === undefined) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Stage position is required');
    }

    if (position < 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Stage position must be a non-negative number');
    }

    return new StagePositionVo({ value: position });
  }
}
