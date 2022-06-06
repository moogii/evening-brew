import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersResolver } from './subscribers.resolver';
import { TopicActionsModule } from '../topic-actions/topic-actions.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [SubscribersResolver, SubscribersService],
  imports: [TopicActionsModule, MailModule, JwtModule.register({})],
})
export class SubscribersModule { }
