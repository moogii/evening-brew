import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    await prisma.cleanDb();
  });


  const demoUser = {
    email: 'authtest@admin.com',
    hash: '$argon2d$v=19$m=16,t=2,p=1$MTIzNDY3ODE$2fsq9Xukvnj7fn2ccxo9MA',
    lastName: '',
    firstName: '',
    twitter: '',
    active: true
  }

  let user: User = null;

  describe('signin', () => {
    it('should create new user', async () => {
      user = await prisma.user.create({
        data: {
          ...demoUser,
          roles: {
            create: { name: 'testAuth' }
          }
        },
      });
      expect(user).toMatchObject(demoUser)
    })

    it('should sign in', async () => {
      const tokens = await service.signIn({
        email: demoUser.email,
        password: 'password',
      });

      expect(tokens).toHaveProperty('accessToken');
    });


    it('should not sign in', async () => {
      expect(service.signIn({
        email: demoUser.email,
        password: 'password1',
      })).rejects.toThrow('Credentials incorrect')
    });
  });

  describe('refresh token', () => {
    it('should refresh token', async () => {
      expect(await service.refresh({
        id: user.id,
        hashIt: 0,
        roles: ['testAuth']
      })).toHaveProperty('accessToken');
    });

    it('should not refresh token', async () => {
      expect(service.refresh({
        id: 0,
        hashIt: 0,
        roles: ['testAuth']
      })).rejects.toThrowError('User not found');
    });

    it('should not refresh token if hash is different', async () => {
      expect(service.refresh({
        id: user.id,
        hashIt: 1,
        roles: ['testAuth']
      })).rejects.toThrowError('Password has changed');
    });
  });

  describe('reset password', () => {
    it('should reset password', async () => {
      const token = await jwt.signAsync({
        sub: user.id,
        it: user.hashIt
      }, {
        expiresIn: '1m',
        secret: `${user.hash}${user.createdAt}`
      })
      expect(await service.resetPassword({
        id: user.id,
        password: 'newpassword',
        token,
      })).toBe<void>(undefined);
    });

    it('should not sign in', async () => {
      expect(service.signIn({
        email: demoUser.email,
        password: 'password',
      })).rejects.toThrow('Credentials incorrect')
    });
  });
});
