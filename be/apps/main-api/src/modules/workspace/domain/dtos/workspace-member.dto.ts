import { IdVo } from "@app/shared/value-object/id.value-object";

export type TWorkspaceMemberProps = {
  workspaceId: IdVo
  fromUserId: IdVo,
  toUserId: IdVo,
  joinAt : Date
}


export interface ICreateMemberProps {
  workspaceId: string;
  fromUserId: string;
  toUserId:string
  role?: 'ADMIN' | 'MEMBER';
}
