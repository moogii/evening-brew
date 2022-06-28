import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { LetterActionsService } from './letter-actions.service';

describe('LetterActionsService', () => {
  let service: LetterActionsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<LetterActionsService>(LetterActionsService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });


  describe('create', () => {

    it('should create letter action', async () => {
      const image = await prisma.image.create({
        data: {
          full: '',
          thumb: '',
        }
      })
      const [letter, subscriber] = await Promise.all([
        prisma.letter.create({
          data: {
            name: 'Test letter',
            slug: 'test-letter',
            topic: {
              create: {
                name: 'Test topic',
                slug: 'test-topic',
              }
            },
            image: {
              create: {
                full: '',
                thumb: '',
              }
            },
            editor: {
              create: {
                email: 'test@test.com',
                firstName: 'Test',
                lastName: 'Test',
                hash: 'hash',
                imageId: image.id,
                twitter: '',
              }
            },
            posts: {
              create: [],
            },
            publishedAt: new Date(),
          },
          include: { data: false }
        }),
        prisma.subscriber.create({
          data: {
            email: 'sf@sf.2',
          }
        }),
      ]);

      expect(await service.create({
        letterId: letter.id,
        subscriberId: subscriber.id,
        action: 'read',
      })).toBeDefined();
    });
  })
});
