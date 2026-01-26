import { Pagination } from "@app/shared/core/base-response.base";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMyWorkspace } from "../../domain/dtos/workspace.dto";
import { IWORKSPACE_REPOSITORY, IWorkspaceRepository } from "../../domain/ports/workspace.repository.port";
import { WorkspaceResponseDto } from "../dto/workspace.dto";
import { WorkspaceApplicationMapper } from "../mapper/workspace.mapper";
import { MyWorkspaceQuery } from "./my-workspace.query";

@QueryHandler(MyWorkspaceQuery)
export class MyWorkspaceQueryHandler implements IQueryHandler<MyWorkspaceQuery>{
  constructor(
    @Inject(IWORKSPACE_REPOSITORY)
    private readonly workspaceRepository : IWorkspaceRepository
  ){}
 async execute(query: MyWorkspaceQuery): Promise<Pagination<WorkspaceResponseDto>> {
    const {userId, limit, page, sortOrder} = query
    const {total, data} = await this.workspaceRepository.getMyWorkspace(new GetMyWorkspace(userId, {
      limit, page, sortOrder
    }))
   const dataResponse = data.map(WorkspaceApplicationMapper.toDtoResponse)

    return new Pagination<WorkspaceResponseDto>(dataResponse, total, query)
  }

}
