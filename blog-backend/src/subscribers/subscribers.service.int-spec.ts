import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribersService } from './subscribers.service';

describe('SubscribersService', () => {
  let service: SubscribersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SubscribersService>(SubscribersService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.cleanDb();
  });

  it('should create a topics', async () => {
    await prisma.topic.createMany({
      data: [{
        name: 'Test topic',
        slug: 'test-topic',
      }, {
        name: 'Test topic 2',
        slug: 'test-topic-2',
      }],
    })
  })

  describe('create', () => {
    it('should create a subscriber', async () => {
      expect(await await service.create({
        email: 'sub@yuain.mn',
        topicId: 1,
      })).toMatchObject({ email: 'sub@yuain.mn' });
    });

    it('should throw an error if subscriber didn\'t confirmed email', async () => {
      try {
        const subscriber = await service.create({
          email: 'sub@yuain.mn',
          topicId: 1,
        });
      } catch (e) {
        expect(e.message).toBe('Please confirm your email address');
      }
    });

    it('should throw an error if subscriber already subscribed to this topic', async () => {
      const topic = await prisma.topic.findFirst({})
      const subscriber = await prisma.subscriber.create({
        data: {
          email: 'sub1@yuain.mn',
          isSubscribed: true,
          topics: {
            connect: [{ id: topic.id }],
          },
        },
      });


      try {
        await service.create({
          email: subscriber.email,
          topicId: topic.id,
        });
      } catch (error) {
        expect(error.message).rejects.toThrow('Subscriber already subscribed to this topic');
      }
    });
  });
});
