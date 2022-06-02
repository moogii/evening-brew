import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderByInput, PaginationInput } from '../users/dto';
import { SubscriberCreateInput } from './dto';
import { SubscribersService } from './subscribers.service';

@Resolver('Subscriber')
export class SubscribersResolver {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Mutation('createSubscriber')
  create(@Args('createSubscriberInput') input: SubscriberCreateInput) {
    return this.subscribersService.create(input);
  }

  @Query('subscribers')
  findAll(
    @Args('pagination') pagination: PaginationInput,
    @Args('orderBy') orderBy?: OrderByInput,
  ) {
    return this.subscribersService.findAll(pagination, orderBy);
  }

  @Query('subscriber')
  findOne(@Args('id') id: number) {
    return this.subscribersService.findOne(id);
  }

  @Mutation('unsubscriberFromTopic')
  unsubscriberFromTopic(@Args('id') id: number, @Args('topicId') topicId: number) {
    return this.subscribersService.unsubscriberFromTopic(id, topicId);
  }
}
