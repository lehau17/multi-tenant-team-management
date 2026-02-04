import { AggregateRoot } from '@app/shared/core/aggregate-root.base';
import { V7Generator } from 'uuidv7';
import { IdVo, ID_TYPE } from '@app/shared/value-object/id.value-object';
import { SchemeNameVo } from '../value-object/scheme-name.value-object';
import { Priority, ICreatePriorityProps } from './priority.entity';

export interface ICreatePrioritySchemeProps {
  workspaceId: string;
  name: string;
  isDefault?: boolean;
}

export interface TPrioritySchemeProps {
  workspaceId: IdVo;
  name: SchemeNameVo;
  isDefault: boolean;
  priorities: Priority[];
}

export class PriorityScheme extends AggregateRoot<TPrioritySchemeProps> {
  constructor(id: string, props: TPrioritySchemeProps) {
    super(id, props);
  }

  get workspaceId(): string {
    return this.props.workspaceId.value as string;
  }

  get name(): string {
    return this.props.name.value;
  }

  get isDefault(): boolean {
    return this.props.isDefault;
  }

  get priorities(): Priority[] {
    return this.props.priorities;
  }

  static create(payload: ICreatePrioritySchemeProps, id?: string): PriorityScheme {
    const schemeId = id || new V7Generator().generate().toString();
    const workspaceIdVo = IdVo.create(payload.workspaceId, ID_TYPE.UUID);
    const nameVo = SchemeNameVo.create(payload.name);

    return new PriorityScheme(schemeId, {
      workspaceId: workspaceIdVo,
      name: nameVo,
      isDefault: payload.isDefault ?? false,
      priorities: [],
    });
  }

  public updateName(name: string): void {
    this.props.name = SchemeNameVo.create(name);
  }

  public setAsDefault(): void {
    this.props.isDefault = true;
  }

  public unsetDefault(): void {
    this.props.isDefault = false;
  }

  public addPriority(priorityData: Omit<ICreatePriorityProps, 'schemeId'>): Priority {
    const priority = Priority.create({
      schemeId: this.id,
      ...priorityData,
    });
    this.props.priorities.push(priority);
    return priority;
  }

  public removePriority(priorityId: string): void {
    this.props.priorities = this.props.priorities.filter(p => p.id !== priorityId);
  }

  public getPriorityById(priorityId: string): Priority | undefined {
    return this.props.priorities.find(p => p.id === priorityId);
  }
}
