import { IPaginationOptions, PaginationQuery } from "@app/shared/core/cqrs-core/base-query-pagination.base";

export interface IMyWorkspaceQueryProps extends IPaginationOptions {
  userId: string;
}

export class MyWorkspaceQuery extends PaginationQuery {
  public readonly userId: string;

  constructor(props: IMyWorkspaceQueryProps) {
    super(props);
    this.userId = props.userId;
  }
}
