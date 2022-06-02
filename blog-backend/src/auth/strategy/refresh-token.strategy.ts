import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserDto } from "../dto";
import { JwtPayload } from "../types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_REFRESH_SECRET')
    });
  }

  private static extractJwt(req: Request): string | null {
    if (
      req.cookies &&
      'gid' in req.cookies &&
      req.cookies.gid.length > 0
    ) {
      return req.cookies.gid;
    }
    return null;
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    return { id: payload.sub, hashIt: payload.it, roles: payload.roles };
  }
}