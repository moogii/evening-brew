import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopicActionsService } from '../topic-actions/topic-actions.service';
import { SubscriberCreateInput } from './dto';
import { OrderByInput, PaginationInput } from '../users/dto';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscribersService {
  constructor(
    private prisma: PrismaService,
    private topicActionService: TopicActionsService,
    private mailService: MailService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async create(input: SubscriberCreateInput) {
    const { topicId, ...subscriberInput } = input;

    const subscriber = await this.prisma.subscriber.findUnique({
      where: { email: subscriberInput.email },
    });

    if (subscriber) {
      if (subscriber.isSubscribed) {
        const isTopicSubbed = await this.prisma.subscriber.findFirst({
          where: {
            id: subscriber.id,
            topics: {
              some: { id: topicId },
            }
          },
        });

        if (isTopicSubbed) {
          throw new ForbiddenException('Subscriber already subscribed to this topic');
        }

        this.prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            topics: {
              connect: { id: topicId },
            }
          },
        });

        this.topicActionService.create({
          topicId,
          subscriberId: subscriber.id,
          action: 'subscribed',
        });

        return subscriber;
      } else {
        throw new ForbiddenException('Please confirm your email address');
      }
    }

    const newSubscriber = await this.prisma.subscriber.create({
      data: {
        ...subscriberInput,
      }
    });

    this.topicActionService.create({
      topicId,
      subscriberId: newSubscriber.id,
      action: 'subscribed',
    });

    const token = await this.jwt.signAsync({
      sub: newSubscriber.email,
    }, {
      expiresIn: '12h',
      secret: `${newSubscriber.email}${newSubscriber.createdAt}`
    });
    const confirmationLink = `${this.config.get('FRONTEND_URL')}/confirm_email?email=${newSubscriber.email}&token=${token}`;

    this.mailService.sendMail(
      newSubscriber.email,
      'Welcome to the newsletter',
      'welcome',
      { confirmationLink }
    );

    return newSubscriber;
  }

  async confirm(subscriberEmail: string, token: string) {

    const subscriber = await this.prisma.subscriber.findUnique({
      where: {
        email: subscriberEmail,
      }
    });

    if (!subscriber) {
      throw new ForbiddenException('Subscriber not found');
    }

    const isValid = await this.jwt.verifyAsync(token, {
      secret: `${subscriberEmail}${subscriber.createdAt}`,
    });

    if (!isValid) {
      throw new ForbiddenException('Invalid token');
    }

    const firstTopicAction = await this.prisma.topicAction.findFirst({
      where: {
        subscriberId: subscriber.id,
        action: 'subscribed',
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    const updatedSubscriber = await this.prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        isSubscribed: true,
        topics: {
          connect: { id: firstTopicAction?.topicId }
        }
      },
    });

    // incrementing referrer's referral count
    if (updatedSubscriber.referrerId)
      this.prisma.subscriber.update({
        where: {
          id: updatedSubscriber.referrerId,
        },
        data: {
          referrals: {
            increment: 1,
          }
        }
      });

    return updatedSubscriber;
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

  findByEmail(email: string) {
    return this.prisma.subscriber.findUnique({
      where: { email },
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
