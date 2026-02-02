import { Plan } from "../entity/plan.entity";

export const IPLAN_REPOSITORY = Symbol("IPlanRepository");

export interface IPlanRepository {
  findAll(): Promise<Plan[]>;
  findByCode(code: string): Promise<Plan | null>;
  existByCode(code: string): Promise<boolean>;
  save(plan: Plan): Promise<void>;
  saveMany(plans: Plan[]): Promise<void>;
}
