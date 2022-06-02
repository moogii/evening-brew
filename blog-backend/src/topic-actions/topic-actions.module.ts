import { Module } from '@nestjs/common';
import { TopicActionsService } from './topic-actions.service';

@Module({
  providers: [TopicActionsService],
  exports: [TopicActionsService],
})
export class TopicActionsModule { }
