import { Injectable, Inject } from '@nestjs/common';
import { IOutboxRepository, OUTBOX_REPOSITORY } from '@app/outbox';
import { IWorkspaceOutboxRepository } from '../../domain/ports/workspace-outbox.port';
import { Workspace } from '../../domain/entity/workspace.entity';
import { WorkspaceEventType } from '../../domain/events/workspace.events';
import { WorkspaceOutbox } from '../persistence/workspace-outbox.orm-entity';

const AGGREGATE_TYPE = 'Workspace';

@Injectable()
export class WorkspaceOutboxRepository implements IWorkspaceOutboxRepository {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepo: IOutboxRepository,
  ) {}

  async saveCreatedEvent(workspace: Workspace): Promise<void> {
    await this.outboxRepo.save(
      {
        aggregateId: workspace.id,
        aggregateType: AGGREGATE_TYPE,
        eventType: WorkspaceEventType.CREATED,
        payload: {
          id: workspace.id,
          name: workspace.workspaceName,
          ownerId: workspace.ownerId,
          slug: workspace.workspaceSlug,
          logo: workspace.workspaceLogo,
        },
      },
      WorkspaceOutbox,
    );
  }

  async saveUpdatedEvent(workspace: Workspace): Promise<void> {
    await this.outboxRepo.save(
      {
        aggregateId: workspace.id,
        aggregateType: AGGREGATE_TYPE,
        eventType: WorkspaceEventType.UPDATED,
        payload: {
          id: workspace.id,
          name: workspace.workspaceName,
          logo: workspace.workspaceLogo,
        },
      },
      WorkspaceOutbox,
    );
  }

  async saveDeletedEvent(workspaceId: string): Promise<void> {
    await this.outboxRepo.save(
      {
        aggregateId: workspaceId,
        aggregateType: AGGREGATE_TYPE,
        eventType: WorkspaceEventType.DELETED,
        payload: {
          id: workspaceId,
        },
      },
      WorkspaceOutbox,
    );
  }
}
