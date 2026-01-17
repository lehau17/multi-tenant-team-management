import { User } from "../entity/user.entity";

export const USER_REPOSITORY = 'IUserRepository';
export interface IUserRepository {
  createUser(user: User): Promise<void>
  findByEmail(email:string) : Promise<User>
}
