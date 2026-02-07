import { DDDBaseEntity } from '@app/shared/core/ddd.entity.base';
import { V7Generator } from 'uuidv7';
import { PriorityNameVo } from '../value-object/priority-name.value-object';
import { PriorityScoreVo } from '../value-object/priority-score.value-object';
import { PriorityColorVo } from '../value-object/priority-color.value-object';
import { PriorityIconVo } from '../value-object/priority-icon.value-object';
import { IdVo, ID_TYPE } from '@app/shared/value-object/id.value-object';

export interface ICreatePriorityProps {
  schemeId: string;
  name: string;
  score: number;
  color: string;
  icon: string;
}

export interface TPriorityProps {
  schemeId: IdVo;
  name: PriorityNameVo;
  score: PriorityScoreVo;
  color: PriorityColorVo;
  icon: PriorityIconVo;
}

export class Priority extends DDDBaseEntity<TPriorityProps> {
  constructor(id: string, props: TPriorityProps) {
    super(id, props);
  }

  get schemeId(): string {
    return this.props.schemeId.value as string;
  }

  get name(): string {
    return this.props.name.value;
  }

  get score(): number {
    return this.props.score.value;
  }

  get color(): string {
    return this.props.color.value;
  }

  get icon(): string {
    return this.props.icon.value;
  }

  static create(payload: ICreatePriorityProps, id?: string): Priority {
    const priorityId = id || new V7Generator().generate().toString();
    const schemeIdVo = IdVo.create(payload.schemeId, ID_TYPE.UUID);
    const nameVo = PriorityNameVo.create(payload.name);
    const scoreVo = PriorityScoreVo.create(payload.score);
    const colorVo = PriorityColorVo.create(payload.color);
    const iconVo = PriorityIconVo.create(payload.icon);

    return new Priority(priorityId, {
      schemeId: schemeIdVo,
      name: nameVo,
      score: scoreVo,
      color: colorVo,
      icon: iconVo,
    });
  }

  public updateName(name: string): void {
    this.props.name = PriorityNameVo.create(name);
  }

  public updateScore(score: number): void {
    this.props.score = PriorityScoreVo.create(score);
  }

  public updateColor(color: string): void {
    this.props.color = PriorityColorVo.create(color);
  }

  public updateIcon(icon: string): void {
    this.props.icon = PriorityIconVo.create(icon);
  }
}
