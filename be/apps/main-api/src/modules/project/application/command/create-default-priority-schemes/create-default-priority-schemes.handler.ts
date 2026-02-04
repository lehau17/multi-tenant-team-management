import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { CreateDefaultPrioritySchemesCommand } from './create-default-priority-schemes.command';
import {
  IPrioritySchemeRepository,
  IPRIORITY_SCHEME_REPOSITORY,
} from '../../../domain/ports/priority-scheme.repository.port';
import { PriorityScheme } from '../../../domain/entity/priority-scheme.entity';
import { DEFAULT_PRIORITY_SCHEMES } from '../../../domain/dtos/priority-scheme.props';

@CommandHandler(CreateDefaultPrioritySchemesCommand)
export class CreateDefaultPrioritySchemesHandler
  implements ICommandHandler<CreateDefaultPrioritySchemesCommand>
{
  private readonly logger = new Logger(CreateDefaultPrioritySchemesHandler.name);

  constructor(
    @Inject(IPRIORITY_SCHEME_REPOSITORY)
    private readonly prioritySchemeRepository: IPrioritySchemeRepository,
  ) {}

  async execute(command: CreateDefaultPrioritySchemesCommand): Promise<void> {
    const { workspaceId } = command;

    const existingSchemes = await this.prioritySchemeRepository.existsByWorkspaceId(workspaceId);
    if (existingSchemes) {
      this.logger.warn(`Priority schemes already exist for workspace ${workspaceId}, skipping creation`);
      return;
    }

    const schemes: PriorityScheme[] = DEFAULT_PRIORITY_SCHEMES.map((template) => {
      const scheme = PriorityScheme.create({
        workspaceId,
        name: template.name,
        isDefault: template.isDefault,
      });

      template.priorities.forEach((priorityData) => {
        scheme.addPriority(priorityData);
      });

      return scheme;
    });

    await this.prioritySchemeRepository.createMultipleSchemesWithPriorities(schemes);

    this.logger.log(
      `Created ${schemes.length} default priority schemes for workspace ${workspaceId}`,
    );
  }
}
