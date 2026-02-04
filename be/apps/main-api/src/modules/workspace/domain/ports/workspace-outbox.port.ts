import { Workspace } from '../entity/workspace.entity';

export const WORKSPACE_OUTBOX_REPOSITORY = Symbol('WORKSPACE_OUTBOX_REPOSITORY');

export interface IWorkspaceOutboxRepository {
  saveCreatedEvent(workspace: Workspace): Promise<void>;
  saveUpdatedEvent(workspace: Workspace): Promise<void>;
  saveDeletedEvent(workspaceId: string): Promise<void>;
}
