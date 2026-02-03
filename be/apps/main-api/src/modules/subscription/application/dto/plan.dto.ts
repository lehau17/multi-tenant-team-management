import { TPlanConfig } from "../../domain/dtos/plan.dto";

export class PlanResponseDto {
  id: string;
  name: string;
  code: string;
  description: string | null;
  price: number;
  currency: string;
  config: TPlanConfig;
  isActive: boolean;

  constructor(
    id: string,
    name: string,
    code: string,
    description: string | null,
    price: number,
    currency: string,
    config: TPlanConfig,
    isActive: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.price = price;
    this.currency = currency;
    this.config = config;
    this.isActive = isActive;
  }
}
