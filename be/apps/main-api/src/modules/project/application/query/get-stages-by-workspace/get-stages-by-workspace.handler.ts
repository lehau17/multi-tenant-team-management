import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { StageProject } from "../../../domain/entity/stage-project.entity";
import { ISTAGE_PROJECT_REPOSITORY, IStageProjectRepository } from "../../../domain/ports/stage-project.repository.port";
import { GetStagesByWorkspaceQuery } from "./get-stages-by-workspace.query";

@QueryHandler(GetStagesByWorkspaceQuery)
export class GetStagesByWorkspaceHandler implements IQueryHandler<GetStagesByWorkspaceQuery> {
    constructor(
        @Inject(ISTAGE_PROJECT_REPOSITORY)
        private readonly stageProjectRepository: IStageProjectRepository,
    ) { }

    async execute(query: GetStagesByWorkspaceQuery): Promise<StageProject[]> {
        return this.stageProjectRepository.getStagesByWorkspace(query.workspaceId);
    }
}
