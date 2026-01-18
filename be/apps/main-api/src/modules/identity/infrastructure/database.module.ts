import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PASSWORD_HASHER } from "../domain/port/password-hasher.port";
import { TOKEN_SERVICE } from "../domain/port/token.service";
import { USER_REPOSITORY } from "../domain/port/user.repository";
import { UserOrmEntity } from "./persistence/user.orm-entity";
import { UserRepositoryImpl } from "./persistence/user.repository.impl";
import { PasswordHasher } from "./service/password-hasher.service";
import { TokenService } from "./service/token.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    {
  provide: USER_REPOSITORY,
  useClass: UserRepositoryImpl

    },
        {
          provide: PASSWORD_HASHER,
          useClass : PasswordHasher
    },
    {
      provide: TOKEN_SERVICE,
      useClass : TokenService
        }

  ],
  exports: [
    USER_REPOSITORY,
    PASSWORD_HASHER,
    TOKEN_SERVICE
  ]
})
export class IdentityDatabaseModule {

}
