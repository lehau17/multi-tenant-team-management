import { StageProject } from '../entity/stage-project.entity';
import { StageTemplateData } from '../dtos/stage-project.props';

export const ISTAGE_PROJECT_REPOSITORY = Symbol('IStageProjectRepository');

export interface IStageProjectRepository {
  createMultipleStages(stages: StageProject[]): Promise<void>;
  findTemplateStages(): Promise<StageTemplateData[]>;
  findByProjectId(projectId: string): Promise<StageProject[]>;
}
