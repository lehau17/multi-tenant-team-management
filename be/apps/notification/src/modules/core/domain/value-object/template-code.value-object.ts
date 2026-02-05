import { ValueObject, CommonTypeValueObject, DomainException, ERROR_CODE } from "@app/shared";

export class TemplateCode extends ValueObject<CommonTypeValueObject> {

  private constructor(props: CommonTypeValueObject) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(code: string): TemplateCode {
    if (!code || code.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_TEMPLATE_CODE, "Template code cannot be empty");
    }

    const normalizedCode = code.toUpperCase().trim();
    const codePattern = /^[A-Z][A-Z0-9_]*$/;

    if (!codePattern.test(normalizedCode)) {
      throw new DomainException(
        ERROR_CODE.INVALID_TEMPLATE_CODE,
        "Template code must start with a letter and contain only uppercase letters, numbers, and underscores"
      );
    }

    return new TemplateCode({ value: normalizedCode });
  }
}
