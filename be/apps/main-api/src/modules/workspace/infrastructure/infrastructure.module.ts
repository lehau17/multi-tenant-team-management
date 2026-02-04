import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IWORKSPACE_MEMBER } from "../domain/ports/workspace-member.repository";
import { WORKSPACE_OUTBOX_REPOSITORY } from "../domain/ports/workspace-outbox.port";
import { IWORKSPACE_REPOSITORY } from "../domain/ports/workspace.repository.port";
import { WorkspaceMemberRepository } from "./adapter/workspace-member.repository";
import { WorkspaceOutboxRepository } from "./adapter/workspace-outbox.repository";
import { WorkspaceRepository } from "./adapter/workspace.repository";
import { WorkspaceMemberOrmEntity } from "./persistence/workspace-memer.orm-entity";
import { WorkspaceOutbox } from "./persistence/workspace-outbox.orm-entity";
import { WorkspaceOrmEntity } from "./persistence/workspace.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceOrmEntity, WorkspaceMemberOrmEntity, WorkspaceOutbox])],
  providers: [
    {
      useClass: WorkspaceRepository,
      provide: IWORKSPACE_REPOSITORY,
    },
    {
      useClass: WorkspaceMemberRepository,
      provide: IWORKSPACE_MEMBER,
    },
    {
      useClass: WorkspaceOutboxRepository,
      provide: WORKSPACE_OUTBOX_REPOSITORY,
    },
  ],
  exports: [IWORKSPACE_REPOSITORY, IWORKSPACE_MEMBER, WORKSPACE_OUTBOX_REPOSITORY],
})
export class InfrastructureModule {}
