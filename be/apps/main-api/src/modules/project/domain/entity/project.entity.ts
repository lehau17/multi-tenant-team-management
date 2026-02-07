import { AggregateRoot } from "@app/shared/core/aggregate-root.base";
import { DomainException } from "@app/shared/error/error-exception";
import { ID_TYPE, IdVo } from "@app/shared/value-object/id.value-object";
import { V7Generator } from "uuidv7";
import { TCreateProject, TProjectProps } from "../dtos/project.props";
import { IdentifierProjectVo } from "../value-object/identifier-project.value-object";
import { NameProjectVo } from "../value-object/name-project.value-object";

export class Project extends AggregateRoot<TProjectProps> {
  constructor(id: string, props: TProjectProps) {
    super(id, props);
  }

  get name(): string {
    return this.props.name.value;
  }

  get identifier(): string {
    return this.props.identifier.value;
  }

  get workspaceId(): string {
    return this.props.workspaceId.value as string;
  }

  get createdBy(): string {
    return this.props.createdBy.value as string;
  }

  static create(payload: TCreateProject, id?: string): Project {
    const projectId = id || new V7Generator().generate().toString();

    const workspaceIdVo = IdVo.create(payload.workspaceId, ID_TYPE.UUID);
    const nameVo = NameProjectVo.create(payload.name);
    const identifierVo = IdentifierProjectVo.create(payload.identifier);
    const createdByVo = IdVo.create(payload.createdBy, ID_TYPE.UUID);

    return new Project(projectId, {
      workspaceId: workspaceIdVo,
      name: nameVo,
      identifier: identifierVo,
      createdBy: createdByVo,
    });
  }

  public updateName(name: string): void {
    this.props.name = NameProjectVo.create(name);
  }

  public updateIdentifier(identifier: string): void {
    this.props.identifier = IdentifierProjectVo.create(identifier);
  }
}
