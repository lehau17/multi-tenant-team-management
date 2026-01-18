import { TokenPayload } from "@app/shared/core/token.core";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokensResponse } from "../../domain/dtos/token.dto";
import { ITokenService } from "../../domain/port/token.service";

@Injectable()
export class TokenService implements ITokenService{
  private accessTokenSecretKey: string
  private refreshTokenSecretKey: string
  private accessTokenExpireIn : number
  private refreshTokenExpireIn : number
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService : ConfigService
  ) {
    this.accessTokenSecretKey = this.configService.get<string>("JWT_ACCESSTOKEN_SECRET_KEY") || "access"
    this.refreshTokenSecretKey = this.configService.get<string>("JWT_REFRESHTOKEN_SECRET_KEY") || "refresh"
    this.accessTokenExpireIn = this.configService.get<number>("JWT_ACCESSTOKEN_EXPIRE_IN")|| 60*60
    this.refreshTokenExpireIn = this.configService.get<number>("JWT__REFRESHTOKEN_EXPIRE_IN") || 60*60*24*365
  }
  async generateTokens(payload: TokenPayload): Promise<TokensResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessTokenSecretKey,
        expiresIn : this.accessTokenExpireIn
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshTokenSecretKey,
        expiresIn : this.refreshTokenExpireIn
      }),
    ])
    return {accessToken, refreshToken}
  }

}
