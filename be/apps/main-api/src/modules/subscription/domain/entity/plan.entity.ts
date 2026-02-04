import { DddAggregateRoot } from "@app/shared/core/ddd-aggregation-root.base";
import { V7Generator } from "uuidv7";
import { ICreatePlanProps, TPlanConfig, TPlanProps } from "../dtos/plan.dto";
import { PlanCodeVo } from "../value-objects/plan-code.value-object";
import { PlanConfigVo } from "../value-objects/plan-config.value-object";
import { PlanNameVo } from "../value-objects/plan-name.value-object";
import { PlanPriceVo } from "../value-objects/plan-price.value-object";

export class Plan extends DddAggregateRoot<TPlanProps> {
  constructor(id: string, props: TPlanProps) {
    super(id, props);
  }

  get name(): string {
    return this.props.name.value;
  }

  get code(): string {
    return this.props.code.value;
  }

  get description(): string | null {
    return this.props.description;
  }

  get price(): number {
    return this.props.price.value;
  }

  get currency(): string {
    return this.props.price.currency;
  }

  get config(): TPlanConfig {
    return this.props.config.toJSON();
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  static create(props: ICreatePlanProps, id?: string): Plan {
    const planId = id || new V7Generator().generate().toString();

    const nameVo = PlanNameVo.create(props.name);
    const codeVo = PlanCodeVo.create(props.code);
    const priceVo = PlanPriceVo.create(props.price, props.currency);
    const configVo = PlanConfigVo.create(props.config);

    return new Plan(planId, {
      name: nameVo,
      code: codeVo,
      description: props.description || null,
      price: priceVo,
      config: configVo,
      isActive: true,
    });
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }

  updateInfo(props: { name?: string; description?: string; price?: number; currency?: string }): void {
    if (props.name !== undefined) {
      this.props.name = PlanNameVo.create(props.name);
    }
    if (props.description !== undefined) {
      this.props.description = props.description || null;
    }
    if (props.price !== undefined || props.currency !== undefined) {
      this.props.price = PlanPriceVo.create(
        props.price ?? this.price,
        props.currency ?? this.currency,
      );
    }
  }

  updateConfig(config: TPlanConfig): void {
    const configVo = PlanConfigVo.create(config);
    this.props.config = configVo;
  }
}
