export class ProjectResponseDto {
  id: string;
  name: string;
  identifier: string;
  workspaceId: string;

  constructor(id: string, name: string, identifier: string, workspaceId: string) {
    this.id = id;
    this.name = name;
    this.identifier = identifier;
    this.workspaceId = workspaceId;
  }
}
