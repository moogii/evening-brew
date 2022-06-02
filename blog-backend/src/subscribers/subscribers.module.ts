import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersResolver } from './subscribers.resolver';
import { TopicActionsModule } from '../topic-actions/topic-actions.module';

@Module({
  providers: [SubscribersResolver, SubscribersService],
  imports: [TopicActionsModule],
})
export class SubscribersModule { }
