import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrderByParams, Users } from '../graphql';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from '../auth/dto';
import { Role } from '../auth/entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PaginationInput, UserUpdateInput, UserCreateInput } from './dto';
import * as argon from 'argon2';
import { nanoid } from 'nanoid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) { }

  async create(input: UserCreateInput) {
    try {
      const { roles, ...createUserInput } = input;

      const hash = await argon.hash(nanoid());

      const user = await this.prisma.user.create({
        data: {
          ...createUserInput,
          hash,
          active: true,
          roles: {
            connect: roles,
          }
        },
      });

      const token = await this.jwt.signAsync({
        sub: user.id,
        it: user.hashIt,
      }, {
        expiresIn: '12h',
        secret: `${user.hash}${user.createdAt}`
      });
      const confirmationLink = `${this.config.get('FRONTEND_URL')}/auth/new_user?id=${user.id}&token=${token}`;

      try {
        this.mailService.sendMail(
          user.email,
          'Email confirmation',
          'confirmation',
          {
            confirmationLink,
          }
        );
      } catch (error) {
        console.log(error);
      }

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken')
      }
      throw error;
    }
  }

  async findAll(orderBy?: OrderByParams, pagination?: PaginationInput): Promise<Users> {
    const { field, direction } = orderBy || {}
    const { take, skip } = pagination || {}
    const [total, list] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        orderBy: { [field]: direction },
        take,
        skip,
      })
    ]);
    return {
      total,
      list,
    }
  }

  findOne(id: number, userDto: UserDto) {
    if (id === userDto.id || userDto.roles.includes(Role.ADMIN)) {
      return this.prisma.user.findUnique({
        where: {
          id,
        }
      });
    } else {
      throw new ForbiddenException('Forbidden resource')
    }
  }

  async update(input: UserUpdateInput, userDto: UserDto) {
    if (input.id === userDto.id || userDto.roles.includes(Role.ADMIN)) {
      if (!userDto.roles.includes(Role.ADMIN)) {
        delete input.roles;
      }

      delete input.hash;

      if (input.id === userDto.id) {

        if (input.email) {
          const user = await this.prisma.user.findUnique({
            where: {
              id: input.id
            }
          });

          const token = this.jwt.sign({
            sub: user.id,
            email: input.email,
          }, {
            expiresIn: '3h',
            secret: `${user.hash}${user.createdAt}`
          });

          const confirmationLink = `${this.config.get('FRONTEND_URL')}/user/email_confirmation?token=${token}`;

          // try {
          //   this.mailService.sendMail(
          //     user.email,
          //     'Email update confirmation',
          //     'confirmation',
          //     {
          //       confirmationLink,
          //     }
          //   );
          // } catch (error) { } // this won't work when testing

          // update password
          if (input.oldPassword && input.newPassword) {
            const pwMatches = await argon.verify(user.hash, input.oldPassword);
            if (pwMatches) {
              const hash = await argon.hash(input.newPassword);
              input.hash = hash;
            }
          }
        }
      }

      delete input.email;

      const { roles, ...updateInput } = input;

      return this.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          ...updateInput,
          roles: {
            connect: roles,
          }
        },
      })
    } else {
      throw new ForbiddenException('Forbidden resource')
    }
  }

  async confirmEmail(token: string, userDto: UserDto) {
    const payload: any = this.jwt.decode(token)
    if (payload.sub !== userDto.id) {
      throw new ForbiddenException('Forbidden apple');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      }
    });

    if (!this.jwt.verify(token, { secret: `${user.hash}${user.createdAt}` })) {
      throw new ForbiddenException('Token is expired')
    }

    return this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        email: payload.email,
      }
    });
  }

  remove(id: number) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    })
  }
}
