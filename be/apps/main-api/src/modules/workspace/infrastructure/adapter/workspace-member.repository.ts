import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WorkspaceMember } from "../../domain/entity/workspace-member.entity";
import { IWorkspaceMemberRepository } from "../../domain/ports/workspace-member.repository";
import { WorkspaceMemberMapper } from "../mapper/workspace-member.mapper";
import { WorkspaceMemberOrmEntity } from "../persistence/workspace-memer.orm-entity";

@Injectable()
export class WorkspaceMemberRepository implements IWorkspaceMemberRepository{
  constructor(
    @InjectRepository(WorkspaceMemberOrmEntity)
    private readonly workspaceMemberRepostiroy: Repository<WorkspaceMemberOrmEntity>
  ){}
  async addMemberToWorkspace(workspaceMember: WorkspaceMember): Promise<void> {
    await this.workspaceMemberRepostiroy.save({
      ...WorkspaceMemberMapper.toPersisten(workspaceMember)
    })
  }
 async checkMemberAlreadyExist(userId: string): Promise<boolean> {
   const isExist = await this.workspaceMemberRepostiroy.exists({
     where: {
      toUserId : userId
    }

   })
   return isExist
  }

}
