import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get("JWT_ACCESSTOKEN_SECRET_KEY") || "access";
    console.log("🔑 JwtStrategy initialized with secret:", secret); // 👈 Log khi khởi tạo
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: any): any {
    return payload;
  }
}
