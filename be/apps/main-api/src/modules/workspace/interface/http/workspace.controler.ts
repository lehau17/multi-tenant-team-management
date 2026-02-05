import { BaseResponse, PaginationResponse } from "@app/shared/core/base-response.base";
import { CurrentUser } from "@app/shared/decorator/current-user.decorator";
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AddMemberToWorkspaceCommand } from "../../application/command/add-member-to-workspace/add-member.command";
import { CreateWorkspaceCommand } from "../../application/command/create-workspace/create-workspace.command";
import { MyWorkspaceQuery } from "../../application/query/my-workspace.query";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";

@Controller("/v1/workspace")
export class WorkspaceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @Get("/me")
  async getMyWorkspace(@CurrentUser("user_id") userId: string) {
    const query = new MyWorkspaceQuery({
      userId: userId
    })
    const result = await this.queryBus.execute<MyWorkspaceQuery>(query)
    return PaginationResponse.fromPagination(result)
  }

  @Post()
  async createWorkspace(@Body() { name, logo }: CreateWorkspaceDto, @CurrentUser("user_id") userId: string) {
    const query = new CreateWorkspaceCommand(
      userId,
      name,
      logo
    )
    const id = await this.commandBus.execute<CreateWorkspaceCommand>(query)
    return BaseResponse.created({ id })
  }


  @Post(':id/members/:memberId')
  async addMember(
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @Param('memberId', ParseUUIDPipe) toUserId: string,

    @CurrentUser('user_id') fromUserId: string
  ) {
    const command = new AddMemberToWorkspaceCommand(
      workspaceId,
      fromUserId,
      toUserId
    );

    const isCreated = await this.commandBus.execute<AddMemberToWorkspaceCommand, boolean>(command);

    return BaseResponse.created({ isCreated });
  }
}
