import { Module } from '@nestjs/common';
import { LetterActionsService } from './letter-actions.service';
import { LetterActionsResolver } from './letter-actions.resolver';

@Module({
  providers: [LetterActionsResolver, LetterActionsService]
})
export class LetterActionsModule {}
