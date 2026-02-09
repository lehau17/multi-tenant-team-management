import { AggregateRoot } from "@app/shared/core/aggregate-root.base";
import { IdVo, ID_TYPE } from "@app/shared/value-object/id.value-object";
import { V7Generator } from "uuidv7";
import { TCreateTask, TTaskProps } from "../dtos/task.props";
import { TitleTaskVo } from "../value-object/title-task.value-object";
import { DescriptionTaskVo } from "../value-object/description-task.value-object";
import { NumberTaskVo } from "../value-object/number-task.value-object";
import { PositionTaskVo } from "../value-object/position-task.value-object";
import { AssignIdTaskVo } from "../value-object/assign-id-task.value-object";

export class TaskEntity extends AggregateRoot<TTaskProps> {
    constructor(id: string, props: TTaskProps) {
        super(id, props);
    }

    get title(): string {
        return this.props.title.value;
    }

    get description(): string | null {
        return this.props.description.value;
    }

    get taskNumber(): number {
        return this.props.taskNumber.value;
    }

    get position(): number {
        return this.props.position.value;
    }

    get assignId(): string | null {
        return this.props.assignId.value;
    }

    get stageId(): string {
        return this.props.stageId.value as string;
    }

    get projectId(): string {
        return this.props.projectId.value as string;
    }

    get priorityId(): string {
        return this.props.priorityId.value as string;
    }

    static create(payload: TCreateTask, id?: string): TaskEntity {
        const taskId = id || new V7Generator().generate().toString();

        const titleVo = TitleTaskVo.create(payload.title);
        const descriptionVo = DescriptionTaskVo.create(payload.description || null);
        const taskNumberVo = NumberTaskVo.create(payload.taskNumber);
        const positionVo = PositionTaskVo.create(payload.position);
        const assignIdVo = AssignIdTaskVo.create(payload.assignId || null);
        const stageIdVo = IdVo.create(payload.stageId, ID_TYPE.UUID);
        const projectIdVo = IdVo.create(payload.projectId, ID_TYPE.UUID);
        const priorityIdVo = IdVo.create(payload.priorityId, ID_TYPE.UUID);

        return new TaskEntity(taskId, {
            title: titleVo,
            description: descriptionVo,
            taskNumber: taskNumberVo,
            position: positionVo,
            assignId: assignIdVo,
            stageId: stageIdVo,
            projectId: projectIdVo,
            priorityId: priorityIdVo,
        });
    }

    public updateTitle(title: string): void {
        this.props.title = TitleTaskVo.create(title);
    }

    public updateDescription(description: string | null): void {
        this.props.description = DescriptionTaskVo.create(description);
    }
}