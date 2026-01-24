import { AggregateRoot } from "@app/shared/core/aggregate-root.base";
import { ID_TYPE, IdVo } from "@app/shared/value-object/id.value-object";
import { ICreateMemberProps, TWorkspaceMemberProps } from "../dtos/workspace-member.dto";




export class WorkspaceMember extends AggregateRoot<TWorkspaceMemberProps> {

  private constructor(id: string, props: TWorkspaceMemberProps) {
    super(id, props);
  }




  static create(props: ICreateMemberProps): WorkspaceMember {
    const id = crypto.randomUUID();

    const workspaceIdVo = IdVo.create(props.workspaceId, ID_TYPE.UUID);
    const fromUserVo = IdVo.create(props.fromUserId, ID_TYPE.UUID);
    const toUserVo = IdVo.create(props.toUserId, ID_TYPE.UUID);

    return new WorkspaceMember(id, {
      workspaceId: workspaceIdVo,
      fromUserId: fromUserVo,
      toUserId: toUserVo,
      // role: props.role || 'MEMBER',
      joinAt: new Date()
    });
  }

  get workspaceId(): string {
    return this.props.workspaceId.value as string
  }

  get fromUserId(): string {
    return this.props.fromUserId.value as string;
  }

  get toUserId(): string {
    return this.props.toUserId.value as string;
  }

  get joinAt(): Date {
    return this.props.joinAt as Date;
  }


}
