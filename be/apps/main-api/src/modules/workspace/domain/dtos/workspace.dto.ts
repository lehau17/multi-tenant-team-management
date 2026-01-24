import { IPaginationOptions, PaginationQuery } from "@app/shared/core/cqrs-core/base-query-pagination.base";
import { DomainVo } from "@app/shared/value-object/domain.value-object";
import { IdVo } from "@app/shared/value-object/id.value-object";
import { LinkVo } from "@app/shared/value-object/link.value-object";
import { SlugVo } from "@app/shared/value-object/slug.value-object";

export interface ICreateWorkspaceProps {
  ownerId: string;
  name: string;
  logo?: string;
  slug?: string;
}

export type TWorkspaceProps = {
  workspaceName: string
  workspaceSlug: SlugVo
  workspaceLogo: LinkVo | null
  ownerId: IdVo
  allow_domains: DomainVo[]
}


export class GetMyWorkspace extends PaginationQuery {
  public userId: string

  constructor(userId :string, options: IPaginationOptions) {
    super(options)
    this.userId = userId
  }
}
