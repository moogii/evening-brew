import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Role } from '../auth/entities/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  })

  const userMock = {
    email: `newAdmin@yuain.mn`,
    firstName: 'Admin',
    lastName: 'Admin',
    twitter: '',
  };

  describe('createUser', () => {
    it('should create a user', async () => {

      const image = await prisma.image.create({
        data: {
          full: '',
          thumb: '',
        },
      })

      const role = await prisma.role.create({
        data: {
          name: 'admin',
        }
      });


      const createdUser = await service.create({
        ...userMock,
        roles: [{ id: role.id }],
        imageId: image.id,
      })

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe(userMock.email);
    });

    it('should throw an error if email is already used', async () => {

      const image = await prisma.image.create({
        data: {
          full: '',
          thumb: '',
        },
      })

      const role = await prisma.role.create({
        data: {
          name: 'user',
        }
      });

      await expect(service.create({
        ...userMock,
        imageId: image.id,
        roles: [{ id: role.id }],
      })).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const user = await prisma.user.findUnique({
        where: { email: userMock.email }
      });

      const foundUser = await service.findOne(user.id, {
        id: user.id,
        roles: [Role.ADMIN],
        hashIt: 0
      });

      expect(foundUser).toBeDefined();
    });

    it('should throw an error if user is not who he says or not admin', async () => {
      await expect(service.findOne(1, {
        id: 2,
        roles: [Role.WRITER],
        hashIt: 0,
      })).rejects.toThrow('Forbidden');
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const [total, list] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany(),
      ]);

      await expect(service.findAll()).resolves.toEqual({ total, list });
    });

    it('should find all users with pagination', async () => {
      const [total, list] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
          take: 1,
          skip: 1,
        }),
      ]);

      await expect(service.findAll({}, { take: 1, skip: 1 })).resolves.toEqual({ total, list });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = await prisma.user.findUnique({
        where: {
          email: userMock.email,
        }
      });

      await expect(service.update({
        id: user.id,
        lastName: 'Updated',
      }, {
        id: user.id,
        roles: [Role.ADMIN],
        hashIt: 0,
      })).resolves.toMatchObject({ lastName: 'Updated' });
    });

    it('should throw an error if user is not who he says or not admin', async () => {
      await expect(service.update({
        id: 1,
      }, {
        id: 2,
        roles: [Role.WRITER],
        hashIt: 0,
      })).rejects.toThrow();
    });
  });

  describe('confirm email address', () => {
    it('should confirm a new email', async () => {
      const user = await prisma.user.findFirst({});

      const token = jwt.sign({
        sub: user.id,
        email: user.email,
      }, {
        expiresIn: '5m',
        secret: `${user.hash}${user.createdAt}`
      });

      await expect(service.confirmEmail(token, {
        id: user.id,
        roles: [Role.ADMIN],
        hashIt: 0,
      })).resolves.toMatchObject({
      });
    });

    it('should throw an error if token sub is not equal to user id', async () => {
      const invalidToken = jwt.sign({
        sub: 2,
      }, {
        expiresIn: '5m',
        secret: 'invalid'
      });

      await expect(service.confirmEmail(invalidToken, {
        id: 1,
        roles: [Role.ADMIN],
        hashIt: 0,
      })).rejects.toThrow('Forbidden apple');
    });

    it('should throw an error if token is not valid', async () => {
      const user = await prisma.user.findFirst({});
      const invalidToken = jwt.sign({
        sub: user.id,
      }, {
        expiresIn: '5m',
        secret: 'invalid'
      });

      await expect(service.confirmEmail(invalidToken, {
        id: user.id,
        roles: [Role.ADMIN],
        hashIt: 0,
      })).rejects.toThrow('invalid signature');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = await prisma.user.findFirst({});

      await expect(service.remove(user.id)).resolves.toMatchObject({
        active: false,
      });
    });
  });
});
