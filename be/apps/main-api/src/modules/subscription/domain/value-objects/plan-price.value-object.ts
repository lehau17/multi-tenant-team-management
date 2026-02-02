import { ValueObject } from "@app/shared/core";
import { ERROR_CODE } from "@app/shared/error/error-code";
import { DomainException } from "@app/shared/error/error-exception";

export interface IPlanPriceProps {
  value: number;
  currency: string;
}

export class PlanPriceVo extends ValueObject<IPlanPriceProps> {
  private static readonly SUPPORTED_CURRENCIES = ["USD", "VND", "EUR"];

  private constructor(props: IPlanPriceProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  get currency(): string {
    return this.props.currency;
  }

  static create(price: number, currency: string = "USD"): PlanPriceVo {
    if (price < 0) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_PRICE, "Giá plan không được âm");
    }

    const upperCurrency = currency.toUpperCase();

    if (!this.SUPPORTED_CURRENCIES.includes(upperCurrency)) {
      throw new DomainException(ERROR_CODE.INVALID_PLAN_PRICE, `Currency không hỗ trợ: ${currency}. Hỗ trợ: ${this.SUPPORTED_CURRENCIES.join(", ")}`);
    }

    return new PlanPriceVo({ value: price, currency: upperCurrency });
  }
}
