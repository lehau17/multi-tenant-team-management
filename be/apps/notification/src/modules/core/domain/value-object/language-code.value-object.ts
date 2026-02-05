import { ValueObject, CommonTypeValueObject, DomainException, ERROR_CODE } from "@app/shared";

const SUPPORTED_LANGUAGES = ['vi', 'en', 'ja', 'ko', 'zh'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export class LanguageCode extends ValueObject<CommonTypeValueObject> {

  private constructor(props: CommonTypeValueObject) {
    super(props);
  }

  get value(): SupportedLanguage {
    return this.props.value as SupportedLanguage;
  }

  static create(code: string): LanguageCode {
    if (!code || code.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_LANGUAGE_CODE, "Language code cannot be empty");
    }

    const normalizedCode = code.toLowerCase().trim();

    if (!SUPPORTED_LANGUAGES.includes(normalizedCode as SupportedLanguage)) {
      throw new DomainException(
        ERROR_CODE.INVALID_LANGUAGE_CODE,
        `Unsupported language code: ${normalizedCode}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    return new LanguageCode({ value: normalizedCode });
  }

  static vietnamese(): LanguageCode {
    return new LanguageCode({ value: 'vi' });
  }

  static english(): LanguageCode {
    return new LanguageCode({ value: 'en' });
  }

  isDefault(): boolean {
    return this.props.value === 'vi';
  }
}
