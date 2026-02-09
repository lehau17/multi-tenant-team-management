import { IQuery } from "@nestjs/cqrs";

export class GetStagesByWorkspaceQuery implements IQuery {
    constructor(public readonly workspaceId: string) { }
}
