export type TWorkspaceResponse = {
  id: string
  workspaceName: string
  workspaceLogo: string | null
  workspaceSlug: string | null
}

export type TCreateWorkspaceRequest = {
  name: string
  logo?: string
}

export type TAddMemberResponse = {
  isCreated: boolean
}
