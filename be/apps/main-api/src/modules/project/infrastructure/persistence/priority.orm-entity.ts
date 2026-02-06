import { TypeOrmBaseEntity } from '@app/shared';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PrioritySchemeOrmEntity } from './priority-scheme.orm-entity';
import { TaskOrmEntity } from './task.orm-entity';

@Entity('priorities')
export class PriorityOrmEntity extends TypeOrmBaseEntity {
  @Index()
  @Column({ name: 'scheme_id', type: 'uuid' })
  schemeId: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'score', type: 'int' })
  score: number;

  @Column({ name: 'color', type: 'varchar', length: 7 })
  color: string;

  @Column({ name: 'icon', type: 'varchar', length: 100 })
  icon: string;

  @ManyToOne(() => PrioritySchemeOrmEntity, (scheme) => scheme.priorities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scheme_id' })
  scheme: PrioritySchemeOrmEntity;


  @OneToMany(() => TaskOrmEntity, (task) => task.priority)
  tasks: TaskOrmEntity[]
}
