import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface INumberTaskProps {
    value: number;
}

export class NumberTaskVo extends ValueObject<INumberTaskProps> {
    private constructor(props: INumberTaskProps) {
        super(props);
    }

    get value(): number {
        return this.props.value;
    }

    static create(number: number): NumberTaskVo {
        if (number === null || number === undefined) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Task number không được để trống");
        }

        if (!Number.isInteger(number)) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Task number phải là số nguyên");
        }

        if (number < 0) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Task number phải là số dương");
        }

        return new NumberTaskVo({ value: number });
    }
}
