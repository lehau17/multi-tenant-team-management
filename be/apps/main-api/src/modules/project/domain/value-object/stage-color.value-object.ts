import { ValueObject } from '@app/shared/core';
import { DomainException, ERROR_CODE } from '@app/shared';

interface IStageColorProps {
  value: string;
}

export class StageColorVo extends ValueObject<IStageColorProps> {
  private static readonly HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  private constructor(props: IStageColorProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(color: string): StageColorVo {
    if (!color || color.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Stage color cannot be empty');
    }

    const trimmed = color.trim();

    if (!this.HEX_COLOR_REGEX.test(trimmed)) {
      throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, 'Stage color must be a valid hex color (e.g., #FF5733)');
    }

    return new StageColorVo({ value: trimmed.toUpperCase() });
  }
}
