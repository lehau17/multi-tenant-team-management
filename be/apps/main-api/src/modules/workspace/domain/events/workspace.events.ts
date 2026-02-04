export enum WorkspaceEventType {
  CREATED = 'workspace.created',
  UPDATED = 'workspace.updated',
  DELETED = 'workspace.deleted',
}

export interface WorkspaceCreatedPayload {
  id: string;
  name: string;
  ownerId: string;
  slug: string;
  logo: string;
}

export interface WorkspaceUpdatedPayload {
  id: string;
  name?: string;
  logo?: string;
}

export interface WorkspaceDeletedPayload {
  id: string;
}
