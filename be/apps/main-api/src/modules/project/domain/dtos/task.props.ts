import { IdVo } from "@app/shared/value-object/id.value-object";
import { TitleTaskVo } from "../value-object/title-task.value-object";
import { DescriptionTaskVo } from "../value-object/description-task.value-object";
import { NumberTaskVo } from "../value-object/number-task.value-object";
import { PositionTaskVo } from "../value-object/position-task.value-object";
import { AssignIdTaskVo } from "../value-object/assign-id-task.value-object";

export type TTaskProps = {
    title: TitleTaskVo;
    description: DescriptionTaskVo;
    taskNumber: NumberTaskVo;
    position: PositionTaskVo;
    assignId: AssignIdTaskVo;
    stageId: IdVo;
    projectId: IdVo;
    priorityId: IdVo;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TCreateTask = {
    title: string;
    description?: string;
    taskNumber: number;
    position: number;
    assignId?: string;
    stageId: string;
    projectId: string;
    priorityId: string;
}
