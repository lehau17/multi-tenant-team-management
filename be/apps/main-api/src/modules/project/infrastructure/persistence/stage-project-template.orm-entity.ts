import { TypeOrmBaseEntity } from "@app/shared";
import { StageType } from "@app/shared/core/enum/stage-type.enum";
import { Column, Entity } from "typeorm";

@Entity('stage_project_templates')
export class StageProjectTemplateOrmEntity extends TypeOrmBaseEntity {
    @Column()
    name: string

    @Column({ type: "enum", enum: StageType, default: StageType.BACKLOG })
    type: StageType

    @Column({ type: "float64", nullable: true })
    position: number

    @Column({ type: "varchar", nullable: true })
    color: string
}
