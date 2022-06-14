import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthInput, ResetPasswordInput, UserDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async signIn(authInput: AuthInput) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: authInput.email,
      },
      select: {
        roles: true,
        active: true,
        hashIt: true,
        id: true,
        hash: true,
      }
    });
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect')
    }

    if (!user.active) {
      throw new ForbiddenException('Account is disabled');
    }

    // compare password
    const pwMatches = await argon.verify(user.hash, authInput.password);
    // if password does not match throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect')
    }

    return this.signToken(user);
  }

  async refresh(jwtPayload: UserDto) {
    const { id, hashIt } = jwtPayload;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        roles: true,
        active: true,
        hashIt: true,
        id: true,
      }
    });

    // if user does not exist throw exception
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // check hash iterators
    if (user.hashIt !== hashIt) {
      throw new ForbiddenException('Password has changed')
    }

    if (!user.active) {
      throw new ForbiddenException('Account is disabled');
    }

    user.roles.map(role => (role.name))

    return this.signToken(user);
  }

  async signToken(user: { id: number, hashIt: number, roles: { name: string }[] }) {
    const data = {
      sub: user.id,
      it: user.hashIt,
      roles: user.roles.map(role => (role.name)),
    }

    const accessToken = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret: this.config.get('JWT_ACCESS_SECRET')
    });

    const refreshToken = await this.jwt.signAsync(data, {
      expiresIn: '7d',
      secret: this.config.get('JWT_REFRESH_SECRET')
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  // send reset password url to user's email
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      it: user.hashIt,
    }, {
      expiresIn: '3h',
      secret: `${user.hash}${user.createdAt}`
    });

    const url = `${this.config.get('FRONTEND_URL')}/auth/reset_password?id=${user.id}&token=${token}`

    await this.mailService.sendMail(
      user.email,
      'Reset password',
      'reset_password',
      {
        resetLink: url,
      }
    );

    return;
  }

  // confirm reset password url with token then update password and hash iterator
  async resetPassword(input: ResetPasswordInput) {
    const { id, token, password } = input;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('User not found')
    }

    if (!this.jwt.verify(token, { secret: `${user.hash}${user.createdAt}` })) {
      throw new ForbiddenException('Token is expired')
    }

    // if there is new password update and activate or just activate user
    let hash = user.hash;
    let hashIt = user.hashIt;
    if (password) {
      hash = await argon.hash(password)
      hashIt++;
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        hash,
        hashIt,
        active: true,
      }
    });

    return;
  }
}
