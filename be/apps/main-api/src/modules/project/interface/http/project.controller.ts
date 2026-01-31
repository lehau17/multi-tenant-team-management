import { BaseResponse, PaginationResponse } from "@app/shared/core/base-response.base";
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProjectCommand } from "../../application/command/create-project/create-project.command";
import { ProjectByWorkspaceQuery } from "../../application/query/project-by-workspace.query";
import { CreateProjectDto } from "../dto/create-project.dto";

@Controller("/v1/projects")
export class ProjectController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get("/workspace/:workspaceId")
  async getProjectsByWorkspace(
    @Param("workspaceId", ParseUUIDPipe) workspaceId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const query = new ProjectByWorkspaceQuery({
      workspaceId,
      page,
      limit,
    });

    const result = await this.queryBus.execute<ProjectByWorkspaceQuery>(query);
    return PaginationResponse.fromPagination(result);
  }

  @Post()
  async createProject(@Body() { workspaceId, name, identifier }: CreateProjectDto) {
    const command = new CreateProjectCommand(workspaceId, name, identifier);
    const id = await this.commandBus.execute<CreateProjectCommand>(command);
    return BaseResponse.created({ id });
  }
}
