import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface IPositionTaskProps {
    value: number;
}

export class PositionTaskVo extends ValueObject<IPositionTaskProps> {
    private constructor(props: IPositionTaskProps) {
        super(props);
    }

    get value(): number {
        return this.props.value;
    }

    static create(position: number): PositionTaskVo {
        if (position === null || position === undefined) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Vị trí task không được để trống");
        }

        if (position < 0) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Vị trí task phải là số dương");
        }

        return new PositionTaskVo({ value: position });
    }
}
