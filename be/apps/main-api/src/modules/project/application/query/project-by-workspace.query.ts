import { IPaginationOptions, PaginationQuery } from "@app/shared/core/cqrs-core/base-query-pagination.base";

export interface IProjectByWorkspaceQueryProps extends IPaginationOptions {
  workspaceId: string;
}

export class ProjectByWorkspaceQuery extends PaginationQuery {
  public readonly workspaceId: string;

  constructor(props: IProjectByWorkspaceQueryProps) {
    super(props);
    this.workspaceId = props.workspaceId;
  }
}
