import { Test, TestingModule } from '@nestjs/testing';
import { TopicActionsService } from './topic-actions.service';

describe('TopicActionsService', () => {
  let service: TopicActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicActionsService],
    }).compile();

    service = module.get<TopicActionsService>(TopicActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
