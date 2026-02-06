import { IPaginationOptions, PaginationQuery } from "@app/shared/core/cqrs-core/base-query-pagination.base"
import { IdVo } from "@app/shared/value-object/id.value-object"
import { IdentifierProjectVo } from "../value-object/identifier-project.value-object"
import { NameProjectVo } from "../value-object/name-project.value-object"

export type TProjectProps = {
  workspaceId: IdVo
  name: NameProjectVo
  identifier: IdentifierProjectVo
  createdBy: IdVo
}

export type TCreateProject = {
  workspaceId: string
  name: string
  identifier: string
  createdBy: string
}

export class GetProjectsByWorkspace extends PaginationQuery {
  public workspaceId: string

  constructor(workspaceId: string, options: IPaginationOptions) {
    super(options)
    this.workspaceId = workspaceId
  }
}
