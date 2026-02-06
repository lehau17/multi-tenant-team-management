import { StageProject } from '../../domain/entity/stage-project.entity';
import { StageProjectOrmEntity } from '../persistence/stage-project.orm-entity';

export class StageProjectInfraMapper {
  static toDomain(orm: StageProjectOrmEntity): StageProject {
    return StageProject.create(
      {
        projectId: orm.project?.id ?? '',
        name: orm.name,
        type: orm.type,
        position: orm.position,
        color: orm.color,
      },
      orm.id,
    );
  }

  static toOrmEntity(stage: StageProject): StageProjectOrmEntity {
    const orm = new StageProjectOrmEntity();
    orm.id = stage.id;
    orm.name = stage.name;
    orm.type = stage.type;
    orm.position = stage.position;
    orm.color = stage.color;
    orm.project = { id: stage.projectId } as any;
    return orm;
  }
}
