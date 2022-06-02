import { ArgumentMetadata, createParamDecorator, ExecutionContext, Injectable, PipeTransform } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../dto";

@Injectable()
export class JwtPipe implements PipeTransform {
  constructor(private jwt: JwtService) {
  }
  transform(value: UserDto | string | undefined, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      const decoded = this.jwt.decode(value)
      return {
        id: decoded['sub'],
        hashIt: decoded['it'],
        roles: decoded['roles'],
      };
    } else {
      return value;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): Promise<UserDto | string | undefined> => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (request.user) {
      if (data) {
        return request.user[data]
      }
      return request.user;
    } else {
      if (request?.headers?.authorization) {
        const jwt = request.headers.authorization.split(' ')[1];
        return jwt;
      }
      return null;
    }
  }
)

// use this when without using useGuards
export const CurrentUserPipe = (data?: string | undefined) => CurrentUser(data, JwtPipe)