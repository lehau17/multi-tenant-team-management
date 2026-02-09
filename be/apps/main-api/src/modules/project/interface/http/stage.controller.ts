import { BaseResponse } from "@app/shared/core/base-response.base";
import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetStagesByWorkspaceQuery } from "../../application/query/get-stages-by-workspace/get-stages-by-workspace.query";

@Controller("/v1/workspaces")
export class StageController {
    constructor(private readonly queryBus: QueryBus) { }

    @Get("/:workspaceId/stages")
    async getStagesByWorkspace(@Param("workspaceId", ParseUUIDPipe) workspaceId: string) {
        const query = new GetStagesByWorkspaceQuery(workspaceId);
        const result = await this.queryBus.execute(query);
        return BaseResponse.ok(result);
    }
}
