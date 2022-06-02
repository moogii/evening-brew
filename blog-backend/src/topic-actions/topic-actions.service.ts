import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicActionInput } from './dto/create-topic-action.input';

@Injectable()
export class TopicActionsService {
  constructor(private prisma: PrismaService) { }
  create(createTopicActionInput: CreateTopicActionInput) {
    return this.prisma.topicAction.create({
      data: createTopicActionInput,
    });
  }
}
