import { OutboxModule } from "@app/outbox";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AddMemberToWorkspaceHandler } from "./application/command/add-member-to-workspace/add-member.handler";
import { CreateWorkspaceCommandHandler } from "./application/command/create-workspace/create-workspace.handler";
import { MyWorkspaceQueryHandler } from "./application/query/my-workspace.handler";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { WorkspaceOutbox } from "./infrastructure/persistence/workspace-outbox.orm-entity";
import { CreateWorkspaceConsumer } from "./interface/consumer/create-workspace.consumer";
import { WorkspaceController } from "./interface/http/workspace.controler";

@Module({
  imports: [InfrastructureModule, CqrsModule, OutboxModule.forFeature([{entity :  WorkspaceOutbox, tableName : "workspace_outbox", topic : "workspace.created"}])],
  providers: [MyWorkspaceQueryHandler, CreateWorkspaceCommandHandler, AddMemberToWorkspaceHandler],
  controllers : [WorkspaceController, CreateWorkspaceConsumer]
})
export class WorkspaceModule {

}
