import { TypeOrmBaseEntity } from '@app/shared';
import { Column, Entity, Index } from 'typeorm';

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
}
