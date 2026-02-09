import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface IAssignIdTaskProps {
    value: string | null;
}

export class AssignIdTaskVo extends ValueObject<IAssignIdTaskProps> {
    private constructor(props: IAssignIdTaskProps) {
        super(props);
    }

    get value(): string | null {
        return this.props.value;
    }

    static create(assignId: string | null): AssignIdTaskVo {
        if (!assignId) {
            return new AssignIdTaskVo({ value: null });
        }

        // Optional: add UUID validation if needed, but keeping it simple for now as it's an ID reference
        return new AssignIdTaskVo({ value: assignId });
    }
}
