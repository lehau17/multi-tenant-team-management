import { DDDBaseEntity } from '@app/shared/core/ddd.entity.base';
import { V7Generator } from 'uuidv7';
import { IdVo, ID_TYPE } from '@app/shared/value-object/id.value-object';
import { StageType } from '@app/shared/core/enum/stage-type.enum';
import { StageNameVo } from '../value-object/stage-name.value-object';
import { StageColorVo } from '../value-object/stage-color.value-object';
import { StagePositionVo } from '../value-object/stage-position.value-object';

export interface ICreateStageProjectProps {
  projectId: string;
  name: string;
  type: StageType;
  position: number;
  color: string;
}

export interface TStageProjectProps {
  projectId: IdVo;
  name: StageNameVo;
  type: StageType;
  position: StagePositionVo;
  color: StageColorVo;
}

export class StageProject extends DDDBaseEntity<TStageProjectProps> {
  constructor(id: string, props: TStageProjectProps) {
    super(id, props);
  }

  get projectId(): string {
    return this.props.projectId.value as string;
  }

  get name(): string {
    return this.props.name.value;
  }

  get type(): StageType {
    return this.props.type;
  }

  get position(): number {
    return this.props.position.value;
  }

  get color(): string {
    return this.props.color.value;
  }

  static create(payload: ICreateStageProjectProps, id?: string): StageProject {
    const stageId = id || new V7Generator().generate().toString();
    const projectIdVo = IdVo.create(payload.projectId, ID_TYPE.UUID);
    const nameVo = StageNameVo.create(payload.name);
    const positionVo = StagePositionVo.create(payload.position);
    const colorVo = StageColorVo.create(payload.color);

    return new StageProject(stageId, {
      projectId: projectIdVo,
      name: nameVo,
      type: payload.type,
      position: positionVo,
      color: colorVo,
    });
  }
}
