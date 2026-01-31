import axiosInstance from "@/lib/client-api";
import { IPaginationResponse } from "@/models/base-response.model";
import { TAddMemberResponse, TCreateWorkspaceRequest, TWorkspaceResponse } from "./workspace.types";

export const WorkspaceApi = {
  getMyWorkspaces: async (params?: { page?: number; limit?: number }): Promise<IPaginationResponse<TWorkspaceResponse>> => {
    const result = await axiosInstance.get<IPaginationResponse<TWorkspaceResponse>>("/workspace/me", { params })
    return result.data
  },
  createWorkspace: async (payload: TCreateWorkspaceRequest): Promise<{ id: string }> => {
    const result = await axiosInstance.post<{ id: string }>("/workspace", payload)
    return result.data
  },
  addMember: async (workspaceId: string, memberId: string): Promise<TAddMemberResponse> => {
    const result = await axiosInstance.post<TAddMemberResponse>(`/workspace/${workspaceId}/members/${memberId}`)
    return result.data
  }
}
