import { DDDBaseEntity } from "./ddd.entity.base";

export abstract class AggregateRoot<T> extends DDDBaseEntity<T>{
  private _domainEvent: any[] = []

  get domainEvents() {
    return this._domainEvent
  }

  protected addDomainEvent(event: any) {
    this._domainEvent.push(event)
  }

  protected cleanDomainEvent() {
    this._domainEvent = []
  }
}
