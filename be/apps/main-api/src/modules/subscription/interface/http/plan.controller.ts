import { BaseResponse } from "@app/shared/core/base-response.base";
import { Public } from "@app/shared/decorator/public.decorator";
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreatePlanCommand } from "../../application/command/create-plan/create-plan.command";
import { SeedPlansCommand } from "../../application/command/seed-plans/seed-plans.command";
import { TogglePlanStatusCommand } from "../../application/command/toggle-plan-status/toggle-plan-status.command";
import { UpdatePlanCommand } from "../../application/command/update-plan/update-plan.command";
import { GetPlanByIdQuery } from "../../application/query/get-plan-by-id/get-plan-by-id.query";
import { GetPlansQuery } from "../../application/query/get-plans/get-plans.query";
import { CreatePlanDto } from "../dto/create-plan.dto";
import { UpdatePlanDto } from "../dto/update-plan.dto";

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
  @Get("/:id")
  async getPlanById(@Param("id", ParseUUIDPipe) id: string) {
    const plan = await this.queryBus.execute(new GetPlanByIdQuery(id));
    return BaseResponse.ok(plan);
  }

  @Post()
  async createPlan(@Body() dto: CreatePlanDto) {
    const command = new CreatePlanCommand(
      dto.name,
      dto.code,
      dto.price,
      dto.config,
      dto.description,
      dto.currency,
    );
    const id = await this.commandBus.execute(command);
    return BaseResponse.created({ id });
  }

  @Patch("/:id")
  async updatePlan(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlanDto,
  ) {
    const command = new UpdatePlanCommand(
      id,
      dto.name,
      dto.description,
      dto.price,
      dto.currency,
      dto.config,
    );
    await this.commandBus.execute(command);
    return BaseResponse.ok({ updated: true });
  }

  @Patch("/:id/deactivate")
  async deactivatePlan(@Param("id", ParseUUIDPipe) id: string) {
    await this.commandBus.execute(new TogglePlanStatusCommand(id, false));
    return BaseResponse.ok({ deactivated: true });
  }

  @Patch("/:id/activate")
  async activatePlan(@Param("id", ParseUUIDPipe) id: string) {
    await this.commandBus.execute(new TogglePlanStatusCommand(id, true));
    return BaseResponse.ok({ activated: true });
  }

  @Public()
  @Post("/seed")
  async seedPlans() {
    const created = await this.commandBus.execute(new SeedPlansCommand());
    return BaseResponse.created({ seeded: created });
  }
}
