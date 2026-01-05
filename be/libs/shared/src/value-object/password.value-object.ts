import { CommonTypeValueObject, ValueObject } from "../core/value-object.core";

export class PasswordVo extends ValueObject<CommonTypeValueObject>{
  constructor(props: CommonTypeValueObject) {
    super(props)
  }

  static create(password: string) {
    // Validate password

    //
    return new PasswordVo({value:password})
  }
}
