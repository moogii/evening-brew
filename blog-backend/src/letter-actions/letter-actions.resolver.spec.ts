import { Test, TestingModule } from '@nestjs/testing';
import { LetterActionsResolver } from './letter-actions.resolver';
import { LetterActionsService } from './letter-actions.service';

describe('LetterActionsResolver', () => {
  let resolver: LetterActionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LetterActionsResolver, LetterActionsService],
    }).compile();

    resolver = module.get<LetterActionsResolver>(LetterActionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
