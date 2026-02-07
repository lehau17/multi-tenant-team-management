import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Transactional } from "typeorm-transactional";
import { Workspace } from "../../../domain/entity/workspace.entity";
import { IWorkspaceOutboxRepository, WORKSPACE_OUTBOX_REPOSITORY } from "../../../domain/ports/workspace-outbox.port";
import { IWORKSPACE_REPOSITORY, IWorkspaceRepository } from "../../../domain/ports/workspace.repository.port";
import { CreateWorkspaceCommand } from "./create-workspace.command";

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceCommandHandler implements ICommandHandler<CreateWorkspaceCommand> {
  constructor(
    @Inject(IWORKSPACE_REPOSITORY)
    private readonly workspaceRepository: IWorkspaceRepository,
    @Inject(WORKSPACE_OUTBOX_REPOSITORY)
    private readonly outboxRepository: IWorkspaceOutboxRepository,
  ) {}

  @Transactional()
  async execute(command: CreateWorkspaceCommand) {
    const foundWorkspaceWithWorkspaceName = await this.workspaceRepository.existWorkspaceName(command.name);
    if (foundWorkspaceWithWorkspaceName) {
      throw new BadRequestException(ERROR_CODE.WORKSPACENAME_ALREADY_EXIST);
    }

    const workspace = Workspace.create({
      name: command.name,
      logo: command.logo,
      ownerId: command.ownerId,
    });

    await this.workspaceRepository.createWorkspace(workspace);
    await this.outboxRepository.saveCreatedEvent(workspace);

    return workspace.id;
  }
}
