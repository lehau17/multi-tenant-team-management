import { TypeOrmBaseEntity } from '@app/shared';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { StageProjectOrmEntity } from './stage-project.orm-entity';

@Entity('projects')
export class ProjectOrmEntity extends TypeOrmBaseEntity {

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ name: 'identifier', type: 'varchar', length: 12 })
  identifier: string;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId: string;

  @OneToMany(() => StageProjectOrmEntity, (stageProject) => stageProject.project)
  stageProjects: StageProjectOrmEntity[]
}
