import { DDDBaseEntity } from "@app/shared";
import { LanguageCode } from "../value-object/language-code.value-object";
import { TemplateContent } from "../value-object/template-content.value-object";

export type TNotificationTemplateTranslationProps = {
  templateId: string;
  languageCode: LanguageCode;
  content: TemplateContent;
  isDefault: boolean;
}

export class NotificationTemplateTranslation extends DDDBaseEntity<TNotificationTemplateTranslationProps> {

  get templateId(): string {
    return this.props.templateId;
  }

  get languageCode(): LanguageCode {
    return this.props.languageCode;
  }

  get content(): TemplateContent {
    return this.props.content;
  }

  get isDefault(): boolean {
    return this.props.isDefault;
  }

  private constructor(props: TNotificationTemplateTranslationProps, id?: string) {
    super(id, props);
  }

  static create(props: {
    templateId: string;
    languageCode: LanguageCode;
    content: TemplateContent;
    isDefault?: boolean;
  }): NotificationTemplateTranslation {
    return new NotificationTemplateTranslation({
      ...props,
      isDefault: props.isDefault ?? props.languageCode.isDefault(),
    });
  }

  static reconstitute(props: TNotificationTemplateTranslationProps, id: string): NotificationTemplateTranslation {
    return new NotificationTemplateTranslation(props, id);
  }

  updateContent(content: TemplateContent): void {
    this.props.content = content;
  }

  setAsDefault(): void {
    this.props.isDefault = true;
  }

  unsetAsDefault(): void {
    this.props.isDefault = false;
  }

  render(data: Record<string, string>): { subject?: string; body: string } {
    return this.props.content.render(data);
  }
}
