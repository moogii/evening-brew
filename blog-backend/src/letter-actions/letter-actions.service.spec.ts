import { Test, TestingModule } from '@nestjs/testing';
import { LetterActionsService } from './letter-actions.service';

describe('LetterActionsService', () => {
  let service: LetterActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LetterActionsService],
    }).compile();

    service = module.get<LetterActionsService>(LetterActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
