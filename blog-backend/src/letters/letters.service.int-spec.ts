import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { LettersService } from './letters.service';

describe('LettersService', () => {
  let service: LettersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<LettersService>(LettersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
