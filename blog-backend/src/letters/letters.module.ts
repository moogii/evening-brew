import { Module } from '@nestjs/common';
import { LettersService } from './letters.service';
import { LettersResolver } from './letters.resolver';

@Module({
  providers: [LettersResolver, LettersService]
})
export class LettersModule {}
