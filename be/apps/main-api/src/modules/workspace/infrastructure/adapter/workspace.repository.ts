import { BasePaginationQueryResponse } from "@app/shared/core/base-pagination-query.base";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetMyWorkspace } from "../../domain/dtos/workspace.dto";
import { Workspace } from "../../domain/entity/workspace.entity";
import { IWorkspaceRepository } from "../../domain/ports/workspace.repository.port";
import { WorkspaceMapper } from "../mapper/workspace.mapper";
import { WorkspaceOrmEntity } from "../persistence/workspace.orm-entity";


@Injectable()
export class WorkspaceRepository implements IWorkspaceRepository{
  constructor(
    @InjectRepository(WorkspaceOrmEntity)
    private readonly workspaceRepository : Repository<WorkspaceOrmEntity>
  ){}
async  existWorkspaceName(workspaceName: string): Promise<boolean> {
    return await this.workspaceRepository.exists({
      where: {
        workspaceName : workspaceName
      }
    })
  }
 async createWorkspace(workspace: Workspace): Promise<void> {

    const ormEntity = this.workspaceRepository.create({
      id: workspace.id,
      workspaceName: workspace.workspaceName,
      workspaceSlug: workspace.workspaceSlug,
      logoUrl: workspace.workspaceLogo,
      ownerId: workspace.ownerId,
      allowDomains: workspace.allowDomains,
    });

    await this.workspaceRepository.save(ormEntity);
  }
 async getMyWorkspace(query: GetMyWorkspace): Promise<BasePaginationQueryResponse<Workspace[]>> {
   const [data , total] = await this.workspaceRepository.findAndCount({
     where: {
       ownerId: query.userId,
     },
     skip: query.skip,
     take: query.limit,
     order: {
       createdAt :query.sortOrder
     }
   })
   const dataResponse = data.map(e => WorkspaceMapper.toDomain(e))
   return {
     data: dataResponse,
     total
   }
  }

}
