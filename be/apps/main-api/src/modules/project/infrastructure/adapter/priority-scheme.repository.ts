import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPrioritySchemeRepository } from '../../domain/ports/priority-scheme.repository.port';
import { PriorityScheme } from '../../domain/entity/priority-scheme.entity';
import { PrioritySchemeOrmEntity } from '../persistence/priority-scheme.orm-entity';
import { PriorityOrmEntity } from '../persistence/priority.orm-entity';
import { PrioritySchemeInfraMapper } from '../mapper/priority-scheme.mapper';

@Injectable()
export class PrioritySchemeRepository implements IPrioritySchemeRepository {
  constructor(
    @InjectRepository(PrioritySchemeOrmEntity)
    private readonly schemeRepository: Repository<PrioritySchemeOrmEntity>,
    @InjectRepository(PriorityOrmEntity)
    private readonly priorityRepository: Repository<PriorityOrmEntity>,
  ) {}

  async createScheme(scheme: PriorityScheme): Promise<void> {
    const ormEntity = PrioritySchemeInfraMapper.toOrmEntity(scheme);
    await this.schemeRepository.save(ormEntity);
  }

  async createSchemeWithPriorities(scheme: PriorityScheme): Promise<void> {
    const schemeOrm = PrioritySchemeInfraMapper.toOrmEntity(scheme);
    await this.schemeRepository.save(schemeOrm);

    if (scheme.priorities.length > 0) {
      const priorityOrms = scheme.priorities.map((p) =>
        PrioritySchemeInfraMapper.priorityToOrmEntity(p),
      );
      await this.priorityRepository.save(priorityOrms);
    }
  }

  async createMultipleSchemesWithPriorities(schemes: PriorityScheme[]): Promise<void> {
    const schemeOrms = schemes.map((s) => PrioritySchemeInfraMapper.toOrmEntity(s));
    await this.schemeRepository.save(schemeOrms);

    const allPriorities = schemes.flatMap((s) =>
      s.priorities.map((p) => PrioritySchemeInfraMapper.priorityToOrmEntity(p)),
    );

    if (allPriorities.length > 0) {
      await this.priorityRepository.save(allPriorities);
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<PriorityScheme[]> {
    const orms = await this.schemeRepository.find({
      where: { workspaceId },
      relations: ['priorities'],
      order: { createdAt: 'ASC' },
    });

    return orms.map((orm) => PrioritySchemeInfraMapper.toDomain(orm));
  }

  async findDefaultByWorkspaceId(workspaceId: string): Promise<PriorityScheme | null> {
    const orm = await this.schemeRepository.findOne({
      where: { workspaceId, isDefault: true },
      relations: ['priorities'],
    });

    return orm ? PrioritySchemeInfraMapper.toDomain(orm) : null;
  }

  async findById(id: string): Promise<PriorityScheme | null> {
    const orm = await this.schemeRepository.findOne({
      where: { id },
      relations: ['priorities'],
    });

    return orm ? PrioritySchemeInfraMapper.toDomain(orm) : null;
  }

  async updateScheme(scheme: PriorityScheme): Promise<void> {
    const schemeOrm = PrioritySchemeInfraMapper.toOrmEntity(scheme);
    await this.schemeRepository.save(schemeOrm);

    await this.priorityRepository.delete({ schemeId: scheme.id });

    if (scheme.priorities.length > 0) {
      const priorityOrms = scheme.priorities.map((p) =>
        PrioritySchemeInfraMapper.priorityToOrmEntity(p),
      );
      await this.priorityRepository.save(priorityOrms);
    }
  }

  async deleteScheme(id: string): Promise<void> {
    await this.schemeRepository.delete({ id });
  }

  async existsByWorkspaceId(workspaceId: string): Promise<boolean> {
    return await this.schemeRepository.exists({ where: { workspaceId } });
  }
}
