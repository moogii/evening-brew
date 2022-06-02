import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserDto } from "../dto";
import { JwtPayload } from "../types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET')
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    return { id: payload.sub, hashIt: payload.it, roles: payload.roles };
  }
}