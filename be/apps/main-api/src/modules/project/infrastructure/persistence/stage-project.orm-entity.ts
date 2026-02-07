import { TypeOrmBaseEntity } from "@app/shared";
import { StageType } from "@app/shared/core/enum/stage-type.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProjectOrmEntity } from "./project.orm-entity";
import { TaskOrmEntity } from "./task.orm-entity";

@Entity('stage_projects')
export class StageProjectOrmEntity extends TypeOrmBaseEntity {
    @Column()
    name: string

    @Column({ type: "enum", enum: StageType, default: StageType.BACKLOG })
    type: StageType

    @ManyToOne(() => ProjectOrmEntity, (project) => project.stageProjects)
    project: ProjectOrmEntity

    @Column({ type: "float64", nullable: true })
    position: number

    @Column({ type: "varchar", nullable: true })
    color: string

    @OneToMany(() => TaskOrmEntity, (task) => task.stage)
    tasks: TaskOrmEntity[]
}