import { PlanCodeVo } from "../value-objects/plan-code.value-object";
import { PlanConfigVo } from "../value-objects/plan-config.value-object";
import { PlanNameVo } from "../value-objects/plan-name.value-object";
import { PlanPriceVo } from "../value-objects/plan-price.value-object";

export type TPlanConfig = {
  max_members: number;
  max_projects: number;
};

export type TPlanProps = {
  name: PlanNameVo;
  code: PlanCodeVo;
  description: string | null;
  price: PlanPriceVo;
  config: PlanConfigVo;
  isActive: boolean;
};

export interface ICreatePlanProps {
  name: string;
  code: string;
  description?: string;
  price: number;
  currency?: string;
  config: TPlanConfig;
}
