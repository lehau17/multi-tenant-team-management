import { PriorityScheme } from '../../domain/entity/priority-scheme.entity';
import { Priority } from '../../domain/entity/priority.entity';
import { PrioritySchemeOrmEntity } from '../persistence/priority-scheme.orm-entity';
import { PriorityOrmEntity } from '../persistence/priority.orm-entity';

export class PrioritySchemeInfraMapper {
  static toDomain(orm: PrioritySchemeOrmEntity): PriorityScheme {
    const scheme = PriorityScheme.create(
      {
        workspaceId: orm.workspaceId,
        name: orm.name,
        isDefault: orm.isDefault,
      },
      orm.id,
    );

    if (orm.priorities && orm.priorities.length > 0) {
      orm.priorities.forEach((priorityOrm) => {
        scheme.addPriority({
          name: priorityOrm.name,
          score: priorityOrm.score,
          color: priorityOrm.color,
          icon: priorityOrm.icon,
        });
      });
    }

    return scheme;
  }

  static toOrmEntity(scheme: PriorityScheme): PrioritySchemeOrmEntity {
    const orm = new PrioritySchemeOrmEntity();
    orm.id = scheme.id;
    orm.workspaceId = scheme.workspaceId;
    orm.name = scheme.name;
    orm.isDefault = scheme.isDefault;
    return orm;
  }

  static priorityToOrmEntity(priority: Priority): PriorityOrmEntity {
    const orm = new PriorityOrmEntity();
    orm.id = priority.id;
    orm.schemeId = priority.schemeId;
    orm.name = priority.name;
    orm.score = priority.score;
    orm.color = priority.color;
    orm.icon = priority.icon;
    return orm;
  }
}
