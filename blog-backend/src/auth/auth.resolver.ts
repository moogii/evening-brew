import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator';
import { AuthInput, ResetPasswordInput, UserDto } from './dto';
import { RefreshTokenGuard } from './guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Mutation('signIn')
  async signIn(@Args('authInput') authInput: AuthInput, @Context('req') req: Request) {
    const result = await this.authService.signIn(authInput)
    req.res.cookie("gid", result.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days 
    })

    return result;
  }

  @Mutation('signOut')
  signOut(@Context('req') req: Request) {
    req.res.cookie("gid", "", {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })
    return;
  }

  @Mutation('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@CurrentUser() user: UserDto, @Context('req') req: Request) {
    const result = await this.authService.refresh(user)
    req.res.cookie("gid", result.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days 
    })

    return result;
  }

  @Mutation('forgotPassword')
  forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Mutation('resetPassword')
  resetPassword(@Args('resetPasswordInput') input: ResetPasswordInput) {
    return this.authService.resetPassword(input)
  }
}
