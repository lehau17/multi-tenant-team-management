import { TokenPayload } from "@app/shared/core/token.core"
import { TokensResponse } from "../dtos/token.dto"

export const TOKEN_SERVICE = Symbol("ITokenService")


export interface ITokenService {
  generateTokens(payload : TokenPayload):Promise<TokensResponse>
}
