import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser, Roles } from '../auth/decorator';
import { UserDto } from '../auth/dto';
import { Role } from '../auth/entities';
import { AccessGuard, RolesGuard } from '../auth/guard';
import { PaginationCursorInput, PaginationInput } from '../users/dto';
import { LetterCreateInput, LetterUpdateInput } from './dto';
import { LettersService } from './letters.service';

@Resolver('Letter')
export class LettersResolver {
  constructor(private readonly lettersService: LettersService) { }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @Mutation('createLetter')
  create(
    @Args('createLetterInput') createLetterInput: LetterCreateInput,
    @CurrentUser() user: UserDto,
  ) {
    return this.lettersService.create(createLetterInput, user);
  }

  @Query('letters')
  findAll(
    @Args('topicId') topicId: number,
    @Args('pagination') pagination: PaginationCursorInput,
  ) {
    return this.lettersService.findAll(topicId, pagination);
  }

  @UseGuards(AccessGuard)
  @Query('letterList')
  findForPanel(@Args('pagination') pagination: PaginationInput) {
    return this.lettersService.findForPanel(pagination);
  }

  @Query('letter')
  findOne(@Args('id') id: number) {
    return this.lettersService.findOne(id);
  }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @Mutation('updateLetter')
  update(
    @Args('updateLetterInput') input: LetterUpdateInput,
    @CurrentUser() user: UserDto,
  ) {
    return this.lettersService.update(input.id, input, user);
  }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @Mutation('removeLetter')
  remove(@Args('id') id: number) {
    return this.lettersService.remove(id);
  }
}
