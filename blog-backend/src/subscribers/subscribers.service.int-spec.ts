import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Subscriber, Topic } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribersService } from './subscribers.service';

describe('SubscribersService', () => {
  let service: SubscribersService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SubscribersService>(SubscribersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  })

  let topic: Topic;
  let testSubscriber: Subscriber;

  describe('create', () => {
    it('should create a topics', async () => {
      topic = await prisma.topic.create({
        data: {
          name: 'Test topic 2',
          slug: 'test-topic-2',
        },
      });

      expect(topic).toMatchObject({ slug: 'test-topic-2' });
    })

    it('should create a subscriber', async () => {
      testSubscriber = await service.create({
        email: 'sub@yuain.mn',
        topicId: topic.id,
      });
      expect(testSubscriber).toMatchObject({ email: 'sub@yuain.mn' });
    });

    it('should throw an error if subscriber didn\'t confirmed email', async () => {
      try {
        await service.create({
          email: 'sub@yuain.mn',
          topicId: 1,
        });
      } catch (e) {
        expect(e.message).toBe('Please confirm your email address');
      }
    });

    it('should throw an error if subscriber already subscribed to this topic', async () => {
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
        expect(error.message).toBe('Subscriber already subscribed to this topic');
      }
    });
  });

  describe('confirmEmail', () => {
    it('should throw an error if token is invalid', async () => {
      try {
        await service.confirm(testSubscriber.email, 'invalid token')
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should confirm email', async () => {
      const token = await jwt.signAsync({
        sub: testSubscriber.email,
      }, {
        expiresIn: '1h',
        secret: `${testSubscriber.email}${testSubscriber.createdAt}`
      });

      expect(await service.confirm(testSubscriber.email, token)).toMatchObject({ isSubscribed: true });
    });

    it('should throw an error if subscriber is already confirmed', async () => {
      try {
        await service.confirm(testSubscriber.email, 'test token')
      } catch (error) {
        expect(error.message).toBe('Subscriber already confirmed');
      }
    });
  });

  describe('getSubscribers', () => {
    it('should return subscribers', async () => {
      const subscribers = await service.findAll();
      expect(subscribers.total).toBeGreaterThan(0);
    });
  });

  describe('unsubscribeFromTopic', () => {
    it('should unsubscribe from topic', async () => {
      expect(await service.unsubscriberFromTopic(testSubscriber.id, topic.id)).toMatchObject({ email: testSubscriber.email });
    });
  });

  describe('find', () => {
    it('should return subscriber', async () => {
      expect(await service.findOne(testSubscriber.id)).toMatchObject({ email: testSubscriber.email });
    });

    it('should return null if subscriber not found', async () => {
      expect(await service.findOne(0)).toBeNull();
    });

    it('should return subscriber by email', async () => {
      expect(await service.findByEmail(testSubscriber.email)).toMatchObject({ email: testSubscriber.email });
    });

  });
});
