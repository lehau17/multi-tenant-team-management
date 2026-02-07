import { ERROR_CODE } from "@app/shared/error/error-code";
import { BadRequestException } from "@app/shared/error/error-exception";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Transactional } from "typeorm-transactional";
import { Project } from "../../../domain/entity/project.entity";
import { IPROJECT_REPOSITORY, IProjectRepository } from "../../../domain/ports/project.repository.port";
import { ISTAGE_PROJECT_REPOSITORY, IStageProjectRepository } from "../../../domain/ports/stage-project.repository.port";
import { StageProject } from "../../../domain/entity/stage-project.entity";
import { CreateProjectCommand } from "./create-project.command";

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(IPROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(ISTAGE_PROJECT_REPOSITORY)
    private readonly stageProjectRepository: IStageProjectRepository,
  ) {}

  @Transactional()
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
      createdBy: command.createdBy,
    });

    await this.projectRepository.createProject(project);

    const templates = await this.stageProjectRepository.findTemplateStages();

    if (templates.length > 0) {
      const stages = templates.map((template) =>
        StageProject.create({
          projectId: project.id,
          name: template.name,
          type: template.type,
          position: template.position,
          color: template.color,
        }),
      );

      await this.stageProjectRepository.createMultipleStages(stages);
    }

    return project.id;
  }
}
