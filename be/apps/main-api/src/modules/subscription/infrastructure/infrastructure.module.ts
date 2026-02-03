import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IPLAN_REPOSITORY } from "../domain/ports/plan.repository.port";
import { PlanRepository } from "./adapter/plan.repository";
import { PlanOrmEntity } from "./persistence/plan.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlanOrmEntity])],
  providers: [
    {
      useClass: PlanRepository,
      provide: IPLAN_REPOSITORY,
    },
  ],
  exports: [IPLAN_REPOSITORY],
})
export class InfrastructureModule {}
