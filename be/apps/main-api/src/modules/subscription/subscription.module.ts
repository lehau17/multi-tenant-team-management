import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SeedPlansCommandHandler } from "./application/command/seed-plans/seed-plans.handler";
import { GetPlansQueryHandler } from "./application/query/get-plans/get-plans.handler";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { PlanSeedService } from "./infrastructure/seed/plan.seed";
import { PlanController } from "./interface/http/plan.controller";

@Module({
  imports: [InfrastructureModule, CqrsModule],
  providers: [PlanSeedService, GetPlansQueryHandler, SeedPlansCommandHandler],
  controllers: [PlanController],
})
export class SubscriptionModule {}
