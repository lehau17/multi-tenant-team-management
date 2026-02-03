import { BaseResponse } from "@app/shared/core/base-response.base";
import { Public } from "@app/shared/decorator/public.decorator";
import { Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SeedPlansCommand } from "../../application/command/seed-plans/seed-plans.command";
import { GetPlansQuery } from "../../application/query/get-plans/get-plans.query";

@Controller("/v1/plans")
export class PlanController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Public()
  @Get()
  async getPlans() {
    const plans = await this.queryBus.execute(new GetPlansQuery());
    return BaseResponse.ok(plans);
  }

  @Public()
  @Post("/seed")
  async seedPlans() {
    const created = await this.commandBus.execute(new SeedPlansCommand());
    return BaseResponse.created({ seeded: created });
  }
}
