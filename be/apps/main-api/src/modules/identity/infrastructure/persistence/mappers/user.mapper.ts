import { User } from "../../../domain/entity/user.entity";
import { UserOrmEntity } from "../user.orm-entity";

export class UserMapper {
  static toDomain(user: UserOrmEntity): User {
    return User.create(user.id, {email:user.email, fullname: user.fullname, passwordHash: user.password, salt : user.salt})
  }
  // static toPersistence(user: User): UserOrmEntity{
  //   const userOrm = new UserOrmEntity()
  //   userOrm.email = user.email
  //   userOrm.fullname = user.
  //   return new UserOrmEntity()
  // }


}
