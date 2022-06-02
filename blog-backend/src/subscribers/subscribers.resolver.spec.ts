import { Test, TestingModule } from '@nestjs/testing';
import { SubscribersResolver } from './subscribers.resolver';
import { SubscribersService } from './subscribers.service';

describe('SubscribersResolver', () => {
  let resolver: SubscribersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscribersResolver, SubscribersService],
    }).compile();

    resolver = module.get<SubscribersResolver>(SubscribersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
