import { Injectable } from '@nestjs/common';
import { TopicAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicActionInput } from './dto/create-topic-action.input';

@Injectable()
export class TopicActionsService {
  constructor(private prisma: PrismaService) { }
  create(createTopicActionInput: CreateTopicActionInput): Promise<TopicAction> {
    return this.prisma.topicAction.create({
      data: createTopicActionInput,
    });
  }
}
