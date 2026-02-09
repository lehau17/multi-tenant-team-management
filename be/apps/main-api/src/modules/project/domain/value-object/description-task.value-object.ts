import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface IDescriptionTaskProps {
    value: string | null;
}

export class DescriptionTaskVo extends ValueObject<IDescriptionTaskProps> {
    private static readonly MAX_LENGTH = 5000;

    private constructor(props: IDescriptionTaskProps) {
        super(props);
    }

    get value(): string | null {
        return this.props.value;
    }

    static create(description: string | null): DescriptionTaskVo {
        if (description === null || description === undefined) {
            return new DescriptionTaskVo({ value: null });
        }

        const trimmed = description.trim();

        if (trimmed.length > this.MAX_LENGTH) {
            throw new DomainException(ERROR_CODE.INVALID_DATA_REQUEST, `Mô tả task không được vượt quá ${this.MAX_LENGTH} ký tự`);
        }

        return new DescriptionTaskVo({ value: trimmed });
    }
}
