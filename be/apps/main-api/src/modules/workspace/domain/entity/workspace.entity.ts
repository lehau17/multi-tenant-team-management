import { AggregateRoot } from "@app/shared/core/aggregate-root.base";
import { DomainException } from "@app/shared/error/error-exception";
import { DomainVo } from "@app/shared/value-object/domain.value-object";
import { ID_TYPE, IdVo } from "@app/shared/value-object/id.value-object";
import { LinkVo } from "@app/shared/value-object/link.value-object";
import { SlugVo } from "@app/shared/value-object/slug.value-object";
import { V7Generator } from "uuidv7";
import { ICreateWorkspaceProps, TWorkspaceProps } from "../dtos/workspace.dto";


export class Workspace extends AggregateRoot<TWorkspaceProps> {
  constructor(id: string, props: TWorkspaceProps) {
    super(id, props);
  }

  get workspaceName(): string {
    return this.props.workspaceName;
  }

  get workspaceSlug(): string {
    return this.props.workspaceSlug.props.value
  }

  get workspaceLogo(): string {
    return this.props.workspaceLogo.props.value
  }

  get ownerId(): string {
    return this.props.ownerId.value as string;
  }

  get allowDomains(): string[] {
    return this.props.allow_domains.map(d => d.value);
  }

  static create(props: ICreateWorkspaceProps, id?: string): Workspace {
    const workspaceId = id || new V7Generator().generate().toString()

    const ownerIdVo = IdVo.create(props.ownerId, ID_TYPE.UUID);
    const slugVo = SlugVo.create(props.name, props.ownerId);
    const logoVo = LinkVo.create(props.logo || "");

    return new Workspace(workspaceId, {
      workspaceName: props.name,
      workspaceSlug: slugVo,
      workspaceLogo: logoVo,
      ownerId: ownerIdVo,
      allow_domains: [],
    });
  }

  public updateInfo(props: { name?: string; logo?: string }): void {
    if (props.name) {
      if (props.name.length < 3) throw new DomainException("INVALID_NAME_LENGTH");
      this.props.workspaceName = props.name;
    }
    if (props.logo !== undefined) {
      this.props.workspaceLogo = LinkVo.create(props.logo);
    }
  }

  public addAllowedDomain(domainStr: string): void {
    const isExist = this.props.allow_domains.some(d => d.value === domainStr);
    if (isExist) return;

    const newDomain = DomainVo.create(domainStr);
    this.props.allow_domains.push(newDomain);
  }

  public removeAllowedDomain(domainStr: string): void {
    this.props.allow_domains = this.props.allow_domains.filter(
      d => d.value !== domainStr
    );
  }
}
