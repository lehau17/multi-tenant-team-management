import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "../../domain/entity/plan.entity";
import { IPlanRepository } from "../../domain/ports/plan.repository.port";
import { PlanInfraMapper } from "../mapper/plan.mapper";
import { PlanOrmEntity } from "../persistence/plan.orm-entity";

@Injectable()
export class PlanRepository implements IPlanRepository {
  constructor(
    @InjectRepository(PlanOrmEntity)
    private readonly planRepo: Repository<PlanOrmEntity>,
  ) {}

  async findById(id: string): Promise<Plan | null> {
    const data = await this.planRepo.findOne({ where: { id } });
    if (!data) return null;
    return PlanInfraMapper.toDomain(data);
  }

  async findAll(): Promise<Plan[]> {
    const data = await this.planRepo.find({
      where: { isActive: true },
      order: { price: "ASC" },
    });
    return data.map(PlanInfraMapper.toDomain);
  }

  async findByCode(code: string): Promise<Plan | null> {
    const data = await this.planRepo.findOne({ where: { code } });
    if (!data) return null;
    return PlanInfraMapper.toDomain(data);
  }

  async existByCode(code: string): Promise<boolean> {
    return this.planRepo.exists({ where: { code } });
  }

  async save(plan: Plan): Promise<void> {
    const ormEntity = this.planRepo.create(PlanInfraMapper.toPersistence(plan));
    await this.planRepo.save(ormEntity);
  }

  async saveMany(plans: Plan[]): Promise<void> {
    const ormEntities = plans.map((p) =>
      this.planRepo.create(PlanInfraMapper.toPersistence(p)),
    );
    await this.planRepo.save(ormEntities);
  }
}
