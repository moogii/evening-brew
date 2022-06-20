import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { TopicActionsService } from './topic-actions.service';

describe('TopicActionsService', () => {
  let service: TopicActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TopicActionsService>(TopicActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
