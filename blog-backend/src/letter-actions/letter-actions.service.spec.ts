import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { LetterActionsService } from './letter-actions.service';

describe('LetterActionsService', () => {
  let service: LetterActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<LetterActionsService>(LetterActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
