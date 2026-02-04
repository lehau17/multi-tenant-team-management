import { TypeOrmBaseEntity } from '@app/shared';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PriorityOrmEntity } from './priority.orm-entity';

@Entity('priority_schemes')
export class PrioritySchemeOrmEntity extends TypeOrmBaseEntity {
  @Index()
  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @OneToMany(() => PriorityOrmEntity, (priority) => priority.scheme, {
    cascade: true,
    eager: false,
  })
  priorities: PriorityOrmEntity[];
}
