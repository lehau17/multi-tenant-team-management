import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IWORKSPACE_MEMBER } from "../domain/ports/workspace-member.repository";
import { IWORKSPACE_REPOSITORY } from "../domain/ports/workspace.repository.port";
import { WorkspaceMemberRepository } from "./adapter/workspace-member.repository";
import { WorkspaceRepository } from "./adapter/workspace.repository";
import { WorkspaceMemberOrmEntity } from "./persistence/workspace-memer.orm-entity";
import { WorkspaceOrmEntity } from "./persistence/workspace.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceOrmEntity,WorkspaceMemberOrmEntity])],
  providers: [
    {
    useClass: WorkspaceRepository,
    provide : IWORKSPACE_REPOSITORY
    },
        {
    useClass: WorkspaceMemberRepository,
    provide : IWORKSPACE_MEMBER
    }

  ],
  exports : [IWORKSPACE_REPOSITORY, IWORKSPACE_MEMBER]
})
export class InfrastructureModule {

}
