import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Project } from "../../../domain/entity/project.entity";
import { IPROJECT_REPOSITORY, IProjectRepository } from "../../../domain/ports/project.repository.port";
import { CreateProjectCommand } from "./create-project.command";

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(IPROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand) {
    const existIdentifier = await this.projectRepository.existProjectIdentifier(
      command.workspaceId,
      command.identifier.toUpperCase(),
    );

    if (existIdentifier) {
      throw new BadRequestException(ERROR_CODE.PROJECT_IDENTIFIER_ALREADY_EXIST);
    }

    const project = Project.create({
      workspaceId: command.workspaceId,
      name: command.name,
      identifier: command.identifier,
    });

    await this.projectRepository.createProject(project);

    return project.id;
  }
}
