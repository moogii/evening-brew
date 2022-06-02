import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LetterActionsService } from './letter-actions.service';
import { CreateLetterActionInput } from './dto/create-letter-action.input';

@Resolver('LetterAction')
export class LetterActionsResolver {
  constructor(private readonly letterActionsService: LetterActionsService) { }

  @Mutation('createLetterAction')
  create(@Args('createLetterActionInput') createLetterActionInput: CreateLetterActionInput) {
    return this.letterActionsService.create(createLetterActionInput);
  }
}
