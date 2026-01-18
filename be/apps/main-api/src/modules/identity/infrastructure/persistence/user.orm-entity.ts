import { TypeOrmBaseEntity } from "@app/shared"
import { Column, Entity } from "typeorm"

@Entity({ name: "users" })
export class UserOrmEntity extends TypeOrmBaseEntity {

  @Column({ unique: true })
  email: string

  @Column()
  fullname: string

  @Column()
  password: string

  @Column()
  salt: string

}
