

export class CommonTypeValueObject {
  value : string
}
export abstract class ValueObject<T> {

  constructor(
    public readonly props : T
  ) { }


  public equal(vo?: ValueObject<T>) {
    if (!vo || vo === null || vo === undefined || !vo.props) {
      return false
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
