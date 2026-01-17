import { EmailVo, PasswordVo } from "@app/shared"
import { DddAggregateRoot } from "@app/shared/core/ddd-aggregation-root.base"

type TUser = {
  fullname: string
  email: EmailVo
  password: PasswordVo
  salt : string
}

export class User extends DddAggregateRoot<TUser>  {

  constructor(
    id: string,
    props : TUser
  ) {
    super(id, props)
  }

  get email(): string {
    return this.props.email.props.value
  }

  get password(): string {
    return this.props.password.props.value
  }

  get fullname(): string {
    return this.props.fullname
  }

  get salt(): string{
    return this.props.salt
  }



  static create(id: string, {email, passwordHash, salt,fullname}: {fullname: string, email: string, passwordHash: string, salt: string}) {
    const emailVo = new EmailVo({ value: email })
    const passwordVo = new PasswordVo({value : passwordHash})
    const user = new User(id, { fullname, email: emailVo, password: passwordVo, salt })
    // user.apply()
    return user
  }
}
