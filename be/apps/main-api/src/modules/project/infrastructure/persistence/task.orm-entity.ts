import { TypeOrmBaseEntity } from "@app/shared";
import { Column, Entity, ManyToOne } from "typeorm";
import { StageProjectOrmEntity } from "./stage-project.orm-entity";
import { PriorityOrmEntity } from "./priority.orm-entity";
import { ProjectOrmEntity } from "./project.orm-entity";

@Entity('tasks')
export class TaskOrmEntity extends TypeOrmBaseEntity {

    @Column({ type: 'varchar', nullable: true })
    title: string

    @Column({ type: 'text', nullable: true })
    description: string // markdown

    @ManyToOne(() => StageProjectOrmEntity, (stageProject) => stageProject.tasks)
    stage: StageProjectOrmEntity

    @ManyToOne(() => ProjectOrmEntity, (project) => project.tasks)
    project: ProjectOrmEntity

    @Column({ type: 'int', nullable: true })
    taskNumber: number

    @ManyToOne(() => PriorityOrmEntity, (priority) => priority.tasks)
    priority: PriorityOrmEntity

    @Column({ type: 'varchar', nullable: true })
    assignId: string

    @Column({ type: 'float64', nullable: true })
    position: number








}



