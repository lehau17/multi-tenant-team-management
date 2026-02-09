import { ICommand } from "@nestjs/cqrs";

export class CreateTaskCommand implements ICommand {
    constructor(
        public readonly title: string,
        public readonly stageId: string,
        public readonly projectId: string,
        public readonly priorityId: string,
        public readonly taskNumber: number,
        public readonly position: number,
        public readonly description?: string,
        public readonly assignId?: string,
    ) { }
}
