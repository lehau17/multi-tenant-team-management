import { CommonTypeValueObject, ValueObject } from "../core/value-object.core";



export class EmailVo extends ValueObject<CommonTypeValueObject> {

  constructor(props: CommonTypeValueObject) {
    super(props)
  }
  static create(email: string): EmailVo {
    if (!email || !email.includes('@')) {
      // throw error
    }
    return new EmailVo({value : email})
  }
}
