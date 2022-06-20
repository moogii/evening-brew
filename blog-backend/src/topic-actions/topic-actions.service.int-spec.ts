import { Test, TestingModule } from '@nestjs/testing';
import { Subscriber, Topic } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { TopicActionsService } from './topic-actions.service';

describe('TopicActionsService', () => {
  let service: TopicActionsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TopicActionsService>(TopicActionsService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.cleanDb();
  });

  let topic: Topic = null;
  let subscriber: Subscriber = null;

  it('should create a topic', async () => {
    topic = await prisma.topic.create({
      data: {
        name: 'Test topic',
        slug: 'test-topic',
      }
    });
    expect(topic).toBeDefined();
  });

  it('should create a subscriber', async () => {
    subscriber = await prisma.subscriber.create({
      data: {
        email: 'test@test.com',
      },
    });

    expect(subscriber.email).toBe('test@test.com')
  });

  it('should create a topic action', async () => {
    expect(await service.create({
      topicId: topic.id,
      subscriberId: subscriber.id,
      action: 'subscribed',
    })).toMatchObject({ action: 'subscribed' });
  });
});
