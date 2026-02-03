import { Inject, Injectable } from "@nestjs/common";
import { ICreatePlanProps } from "../../domain/dtos/plan.dto";
import { Plan } from "../../domain/entity/plan.entity";
import {
  IPLAN_REPOSITORY,
  IPlanRepository,
} from "../../domain/ports/plan.repository.port";

const SEED_PLANS: ICreatePlanProps[] = [
  {
    name: "Free",
    code: "free",
    description: "Gói miễn phí cho cá nhân và nhóm nhỏ",
    price: 0,
    currency: "USD",
    config: {
      max_members: 5,
      max_projects: 3,
    },
  },
  {
    name: "Pro",
    code: "pro",
    description: "Gói chuyên nghiệp cho team phát triển",
    price: 9.99,
    currency: "USD",
    config: {
      max_members: 25,
      max_projects: 20,
    },
  },
  {
    name: "Enterprise",
    code: "enterprise",
    description: "Gói doanh nghiệp với tài nguyên không giới hạn",
    price: 49.99,
    currency: "USD",
    config: {
      max_members: 100,
      max_projects: -1,
    },
  },
];

@Injectable()
export class PlanSeedService {
  constructor(
    @Inject(IPLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async seed(): Promise<number> {
    let created = 0;
    const plansToCreate: Plan[] = [];

    for (const seedData of SEED_PLANS) {
      const exists = await this.planRepository.existByCode(seedData.code);
      if (!exists) {
        const plan = Plan.create(seedData);
        plansToCreate.push(plan);
        created++;
      }
    }

    if (plansToCreate.length > 0) {
      await this.planRepository.saveMany(plansToCreate);
    }

    return created;
  }
}
