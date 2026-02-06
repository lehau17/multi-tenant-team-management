import { StageType } from '@app/shared/core/enum/stage-type.enum';

export interface StageTemplateData {
  name: string;
  type: StageType;
  position: number;
  color: string;
}
