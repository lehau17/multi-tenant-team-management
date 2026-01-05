import { AggregateRoot } from "@nestjs/cqrs";

export abstract class DddAggregateRoot<T> extends AggregateRoot{
  constructor(
    public readonly id: string,
    public readonly props : T
  ) {
    super()
    this.autoCommit = false
  }

public equals(object?: DddAggregateRoot<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof DddAggregateRoot)) {
      return false;
    }

    return this.id === object.id;
  }
}
