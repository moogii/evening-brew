import { Test, TestingModule } from '@nestjs/testing';
import { LettersResolver } from './letters.resolver';
import { LettersService } from './letters.service';

describe('LettersResolver', () => {
  let resolver: LettersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LettersResolver, LettersService],
    }).compile();

    resolver = module.get<LettersResolver>(LettersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
