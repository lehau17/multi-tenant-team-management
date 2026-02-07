import { DDDBaseEntity, DomainException, ERROR_CODE } from "@app/shared";
import { TemplateCode } from "../value-object/template-code.value-object";
import { NotificationTemplateTranslation } from "./notification-template-translation.entity";

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

export type TNotificationTemplateProps = {
  code: TemplateCode;
  name: string;
  description?: string;
  channel: NotificationChannel;
  isActive: boolean;
  translations: NotificationTemplateTranslation[];
}

export class NotificationTemplate extends DDDBaseEntity<TNotificationTemplateProps> {

  get code(): TemplateCode {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get channel(): NotificationChannel {
    return this.props.channel;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get translations(): NotificationTemplateTranslation[] {
    return [...this.props.translations];
  }

  private constructor(props: TNotificationTemplateProps, id?: string) {
    super(id, props);
  }

  static create(props: {
    code: TemplateCode;
    name: string;
    description?: string;
    channel: NotificationChannel;
  }): NotificationTemplate {
    return new NotificationTemplate({
      ...props,
      isActive: true,
      translations: [],
    });
  }

  static reconstitute(props: TNotificationTemplateProps, id: string): NotificationTemplate {
    return new NotificationTemplate(props, id);
  }

  addTranslation(translation: NotificationTemplateTranslation): void {
    const existingIndex = this.props.translations.findIndex(
      t => t.languageCode.equal(translation.languageCode)
    );

    if (existingIndex !== -1) {
      throw new DomainException(
        ERROR_CODE.TEMPLATE_TRANSLATION_EXISTS,
        `Translation for language ${translation.languageCode.value} already exists`
      );
    }

    if (this.props.channel === NotificationChannel.EMAIL && !translation.content.subject) {
      throw new DomainException(
        ERROR_CODE.EMAIL_TEMPLATE_REQUIRES_SUBJECT,
        "Email template translation must have a subject"
      );
    }

    this.props.translations.push(translation);
  }

  updateTranslation(translation: NotificationTemplateTranslation): void {
    const existingIndex = this.props.translations.findIndex(
      t => t.languageCode.equal(translation.languageCode)
    );

    if (existingIndex === -1) {
      throw new DomainException(
        ERROR_CODE.TEMPLATE_TRANSLATION_NOT_FOUND,
        `Translation for language ${translation.languageCode.value} not found`
      );
    }

    if (this.props.channel === NotificationChannel.EMAIL && !translation.content.subject) {
      throw new DomainException(
        ERROR_CODE.EMAIL_TEMPLATE_REQUIRES_SUBJECT,
        "Email template translation must have a subject"
      );
    }

    this.props.translations[existingIndex] = translation;
  }

  removeTranslation(languageCode: string): void {
    const initialLength = this.props.translations.length;
    this.props.translations = this.props.translations.filter(
      t => t.languageCode.value !== languageCode
    );

    if (this.props.translations.length === initialLength) {
      throw new DomainException(
        ERROR_CODE.TEMPLATE_TRANSLATION_NOT_FOUND,
        `Translation for language ${languageCode} not found`
      );
    }
  }

  getTranslation(languageCode: string): NotificationTemplateTranslation | undefined {
    return this.props.translations.find(t => t.languageCode.value === languageCode);
  }

  getTranslationOrDefault(languageCode: string, defaultLanguage: string = 'vi'): NotificationTemplateTranslation | undefined {
    return this.getTranslation(languageCode) || this.getTranslation(defaultLanguage);
  }

  updateInfo(name: string, description?: string): void {
    this.props.name = name;
    this.props.description = description;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }
}
