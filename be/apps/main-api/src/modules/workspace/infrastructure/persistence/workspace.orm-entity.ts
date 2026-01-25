import { TypeOrmBaseEntity } from '@app/shared';
import { Column, Entity, Index } from 'typeorm';

@Entity('workspaces')
export class WorkspaceOrmEntity extends TypeOrmBaseEntity {

  @Column({ name: 'workspace_name', type: 'varchar', length: 255,unique :true })
  workspaceName: string;

  @Index()
  @Column({ name: 'workspace_slug', type: 'varchar', unique: true })
  workspaceSlug: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string | null;

  @Index()
  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({
    name: 'allow_domains',
    type: 'jsonb',
    default: [],
    nullable: false
  })
  allowDomains: string[];
}
