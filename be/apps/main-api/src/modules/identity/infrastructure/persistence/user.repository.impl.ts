import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../domain/entity/user.entity";
import { IUserRepository } from "../../domain/port/user.repository";
import { UserMapper } from "./mappers/user.mapper";
import { UserOrmEntity } from "./user.orm-entity";

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
   private readonly userRepository : Repository<UserOrmEntity>

  ) {
  }
 async findByEmail(email: string): Promise<User | null> {
    const foundUser =await this.userRepository.findOne({
      where: {
        email : email
      }
    })
    if (!foundUser) return null
    return UserMapper.toDomain(foundUser)

  }
  async createUser(user: User): Promise<void> {
     await this.userRepository.save(user)
  }

}
