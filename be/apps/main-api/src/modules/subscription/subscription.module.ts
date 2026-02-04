import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CreatePlanCommandHandler } from "./application/command/create-plan/create-plan.handler";
import { SeedPlansCommandHandler } from "./application/command/seed-plans/seed-plans.handler";
import { TogglePlanStatusCommandHandler } from "./application/command/toggle-plan-status/toggle-plan-status.handler";
import { UpdatePlanCommandHandler } from "./application/command/update-plan/update-plan.handler";
import { GetPlanByIdQueryHandler } from "./application/query/get-plan-by-id/get-plan-by-id.handler";
import { GetPlansQueryHandler } from "./application/query/get-plans/get-plans.handler";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { PlanSeedService } from "./infrastructure/seed/plan.seed";
import { PlanController } from "./interface/http/plan.controller";

@Module({
  imports: [InfrastructureModule, CqrsModule],
  providers: [
    PlanSeedService,
    GetPlansQueryHandler,
    GetPlanByIdQueryHandler,
    CreatePlanCommandHandler,
    UpdatePlanCommandHandler,
    TogglePlanStatusCommandHandler,
    SeedPlansCommandHandler,
  ],
  controllers: [PlanController],
})
export class SubscriptionModule {}
