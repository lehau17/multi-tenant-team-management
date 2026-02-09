import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStageProjectRepository } from '../../domain/ports/stage-project.repository.port';
import { StageProject } from '../../domain/entity/stage-project.entity';
import { StageTemplateData } from '../../domain/dtos/stage-project.props';
import { StageProjectOrmEntity } from '../persistence/stage-project.orm-entity';
import { StageProjectTemplateOrmEntity } from '../persistence/stage-project-template.orm-entity';
import { StageProjectInfraMapper } from '../mapper/stage-project.mapper';

@Injectable()
export class StageProjectRepository implements IStageProjectRepository {
  constructor(
    @InjectRepository(StageProjectOrmEntity)
    private readonly stageRepository: Repository<StageProjectOrmEntity>,
    @InjectRepository(StageProjectTemplateOrmEntity)
    private readonly templateRepository: Repository<StageProjectTemplateOrmEntity>,
  ) { }

  async createMultipleStages(stages: StageProject[]): Promise<void> {
    const ormEntities = stages.map((s) => StageProjectInfraMapper.toOrmEntity(s));
    await this.stageRepository.save(ormEntities);
  }

  async findTemplateStages(): Promise<StageTemplateData[]> {
    const templates = await this.templateRepository.find({
      order: { position: 'ASC' },
    });

    return templates.map((t) => ({
      name: t.name,
      type: t.type,
      position: t.position,
      color: t.color,
    }));
  }

  async findByProjectId(projectId: string): Promise<StageProject[]> {
    const orms = await this.stageRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
      order: { position: 'ASC' },
    });
    return orms.map((orm) => StageProjectInfraMapper.toDomain(orm));
  }

  async getStagesByWorkspace(workspaceId: string): Promise<StageProject[]> {
    const orms = await this.stageRepository.find({
      where: { project: { workspaceId } },
      relations: ['project'],
      order: { position: 'ASC' },
      cache: true,
    });

    return orms.map((orm) => StageProjectInfraMapper.toDomain(orm));
  }
}
