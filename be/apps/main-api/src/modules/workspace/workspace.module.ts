import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AddMemberToWorkspaceHandler } from "./application/command/add-member-to-workspace/add-member.handler";
import { CreateWorkspaceCommandHandler } from "./application/command/create-workspace/create-workspace.handler";
import { MyWorkspaceQueryHandler } from "./application/query/my-workspace.handler";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { WorkspaceController } from "./interface/http/workspace.controler";

@Module({
  imports: [InfrastructureModule, CqrsModule],
  providers: [MyWorkspaceQueryHandler, CreateWorkspaceCommandHandler, AddMemberToWorkspaceHandler],
  controllers : [WorkspaceController]
})
export class WorkspaceModule {

}
