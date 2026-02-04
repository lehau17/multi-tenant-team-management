import { BaseOutboxEntity } from "@app/outbox";
import { Entity } from "typeorm";

@Entity('workspace_outbox')
export class WorkspaceOutbox extends BaseOutboxEntity{}
