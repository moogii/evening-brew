import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopicActionsService } from '../topic-actions/topic-actions.service';
import { SubscriberCreateInput } from './dto';
import { OrderByInput, PaginationInput } from '../users/dto';

@Injectable()
export class SubscribersService {
  constructor(
    private prisma: PrismaService,
    private topicActionService: TopicActionsService,
  ) { }

  async create(input: SubscriberCreateInput) {
    const { topicId, ...subscriberInput } = input;

    const subscriber = await this.prisma.subscriber.upsert({
      where: { email: input.email },
      create: {
        ...subscriberInput,
        topics: {
          connect: { id: topicId },
        },
      },
      update: {
        updatedAt: new Date(),
      }
    });

    this.topicActionService.create({
      topicId,
      subscriberId: subscriber.id,
      action: 'subscribed',
    })

    return subscriber;
  }

  async findAll(
    pagination: PaginationInput,
    orderBy?: OrderByInput,
  ) {
    const { take = 20, skip = 0 } = pagination;
    const { field = 'createdAt', direction = 'desc' } = orderBy;
    const [total, list] = await this.prisma.$transaction([
      this.prisma.subscriber.count(),
      this.prisma.post.findMany({
        take,
        skip,
        orderBy: {
          [field]: direction,
        }
      })
    ]);

    return { total, list }
  }

  findOne(id: number) {
    return this.prisma.subscriber.findUnique({
      where: { id },
      include: {
        topics: true,
        topicActions: true,
        letterActions: true,
        referred: true,
        referrer: true,
      }
    });
  }

  async unsubscriberFromTopic(id: number, topicId: number) {
    const subscriber = await this.prisma.subscriber.update({
      where: { id },
      data: {
        topics: {
          disconnect: { id: topicId },
        },
      },
    });

    this.topicActionService.create({
      topicId,
      subscriberId: id,
      action: 'unsubscribed',
    });

    return subscriber;
  }
}
