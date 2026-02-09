import { TaskEntity } from "../../domain/entity/task.entity";
import { TaskOrmEntity } from "../persistence/task.orm-entity";
import { TitleTaskVo } from "../../domain/value-object/title-task.value-object";
import { DescriptionTaskVo } from "../../domain/value-object/description-task.value-object";
import { NumberTaskVo } from "../../domain/value-object/number-task.value-object";
import { PositionTaskVo } from "../../domain/value-object/position-task.value-object";
import { AssignIdTaskVo } from "../../domain/value-object/assign-id-task.value-object";
import { IdVo, ID_TYPE } from "@app/shared/value-object/id.value-object";

export class TaskMapper {
    static toDomain(orm: TaskOrmEntity): TaskEntity {
        return new TaskEntity(orm.id, {
            title: TitleTaskVo.create(orm.title),
            description: DescriptionTaskVo.create(orm.description),
            taskNumber: NumberTaskVo.create(orm.taskNumber),
            position: PositionTaskVo.create(orm.position),
            assignId: AssignIdTaskVo.create(orm.assignId),
            stageId: IdVo.create(orm.stage.id, ID_TYPE.UUID),
            projectId: IdVo.create(orm.project.id, ID_TYPE.UUID),
            priorityId: IdVo.create(orm.priority.id, ID_TYPE.UUID),
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    static toOrm(domain: TaskEntity): TaskOrmEntity {
        // Implement if needed, usually repository handles creation manually for now
        return {} as TaskOrmEntity;
    }
}
