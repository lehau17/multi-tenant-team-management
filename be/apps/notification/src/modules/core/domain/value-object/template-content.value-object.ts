import { ValueObject, DomainException, ERROR_CODE } from "@app/shared";

export type TTemplateContentProps = {
  subject?: string;
  body: string;
  variables: string[];
}

export class TemplateContent extends ValueObject<TTemplateContentProps> {

  private constructor(props: TTemplateContentProps) {
    super(props);
  }

  get subject(): string | undefined {
    return this.props.subject;
  }

  get body(): string {
    return this.props.body;
  }

  get variables(): string[] {
    return [...this.props.variables];
  }

  static create(body: string, subject?: string): TemplateContent {
    if (!body || body.trim().length === 0) {
      throw new DomainException(ERROR_CODE.INVALID_TEMPLATE_CONTENT, "Template body cannot be empty");
    }

    const variablePattern = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();

    let match: RegExpExecArray | null;
    while ((match = variablePattern.exec(body)) !== null) {
      variables.add(match[1]);
    }

    if (subject) {
      variablePattern.lastIndex = 0;
      while ((match = variablePattern.exec(subject)) !== null) {
        variables.add(match[1]);
      }
    }

    return new TemplateContent({
      subject: subject?.trim(),
      body: body.trim(),
      variables: Array.from(variables),
    });
  }

  hasVariable(name: string): boolean {
    return this.props.variables.includes(name);
  }

  render(data: Record<string, string>): { subject?: string; body: string } {
    let renderedBody = this.props.body;
    let renderedSubject = this.props.subject;

    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      renderedBody = renderedBody.replace(new RegExp(placeholder, 'g'), value);
      if (renderedSubject) {
        renderedSubject = renderedSubject.replace(new RegExp(placeholder, 'g'), value);
      }
    }

    return {
      subject: renderedSubject,
      body: renderedBody,
    };
  }
}
