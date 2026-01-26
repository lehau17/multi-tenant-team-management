export class WorkspaceResponseDto {
  id: string
  workspaceName: string
  workspaceLogo: string
  workspaceSlug: string

  constructor(id: string, workspaceName: string, workspaceLogo: string | null, workspaceSlug: string | null) {
    this.id = id
    this.workspaceLogo = workspaceLogo
    this.workspaceName = workspaceName
    this.workspaceSlug = workspaceSlug
  }
}
