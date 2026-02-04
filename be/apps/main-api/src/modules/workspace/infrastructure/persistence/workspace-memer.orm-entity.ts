import {
  Column,
  Entity,
  Index,
  PrimaryColumn
} from 'typeorm';

@Entity('workspace_members')
export class WorkspaceMemberOrmEntity {

  @PrimaryColumn({ name: 'workspace_id', type: 'uuid' })
  workspaceId: string;

  @PrimaryColumn({ name: 'to_user_id', type: 'uuid' })
  @Index()
  toUserId: string;

  @Column({ name: 'from_user_id', type: 'uuid' })
  fromUserId: string;

  @Column({ name: 'joined_at', type: 'timestamp' })
  joinedAt: Date;
}

