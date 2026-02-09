import { PaginationQuery } from "@app/shared/core/cqrs-core/base-query-pagination.base";

export class GetTasksByStageQuery extends PaginationQuery {
    public stageId: string;

    constructor(stageId: string, options: any) {
        super(options);
        this.stageId = stageId;
    }
}
