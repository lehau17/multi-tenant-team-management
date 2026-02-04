import { PriorityScheme } from '../entity/priority-scheme.entity';

export const IPRIORITY_SCHEME_REPOSITORY = Symbol('IPrioritySchemeRepository');

export interface IPrioritySchemeRepository {
  createScheme(scheme: PriorityScheme): Promise<void>;
  createSchemeWithPriorities(scheme: PriorityScheme): Promise<void>;
  createMultipleSchemesWithPriorities(schemes: PriorityScheme[]): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<PriorityScheme[]>;
  findDefaultByWorkspaceId(workspaceId: string): Promise<PriorityScheme | null>;
  findById(id: string): Promise<PriorityScheme | null>;
  updateScheme(scheme: PriorityScheme): Promise<void>;
  deleteScheme(id: string): Promise<void>;
  existsByWorkspaceId(workspaceId: string): Promise<boolean>;
}
