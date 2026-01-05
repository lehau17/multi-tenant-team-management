export abstract class DDDBaseEntity<T>{
  protected readonly _id: string
  protected props : T
  constructor(
     id: string,
     props : T
  ) {
    this._id = id
    this.props = props
  }

  get id(): string{
    return this._id
  }


  public equal(t: DDDBaseEntity<T>) {
    if (!t || !t.id || !this.id) {
      return false
    }
    return this.id === t.id
  }
}
