import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface ITitleTaskProps {
    value: string;
}

export class TitleTaskVo extends ValueObject<ITitleTaskProps> {
    private static readonly MIN_LENGTH = 1;
    private static readonly MAX_LENGTH = 255;

    private constructor(props: ITitleTaskProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    static create(title: string): TitleTaskVo {
        if (!title || title.trim().length === 0) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, "Tên task không được để trống");
        }

        const trimmed = title.trim();

        if (trimmed.length < this.MIN_LENGTH) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Tên task phải có ít nhất ${this.MIN_LENGTH} ký tự`);
        }

        if (trimmed.length > this.MAX_LENGTH) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Tên task không được vượt quá ${this.MAX_LENGTH} ký tự`);
        }

        return new TitleTaskVo({ value: trimmed });
    }
}
