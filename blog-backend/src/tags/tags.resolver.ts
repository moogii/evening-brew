import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TagCreateInput, TagUpdateInput } from './dto';
import { TagsService } from './tags.service';

@Resolver('Tag')
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) { }

  @Mutation('createTag')
  create(@Args('createTagInput') createTagInput: TagCreateInput) {
    return this.tagsService.create(createTagInput);
  }

  @Query('tags')
  findAll() {
    return this.tagsService.findAll();
  }

  @Query('tag')
  findOne(@Args('id') id: number) {
    return this.tagsService.findOne(id);
  }

  @Mutation('updateTag')
  update(@Args('updateTagInput') updateTagInput: TagUpdateInput) {
    return this.tagsService.update(updateTagInput);
  }

  @Mutation('removeTag')
  remove(@Args('id') id: number) {
    return this.tagsService.remove(id);
  }
}
