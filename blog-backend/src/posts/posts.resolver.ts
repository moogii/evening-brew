import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser, Roles } from '../auth/decorator';
import { UserDto } from '../auth/dto';
import { Role } from '../auth/entities';
import { AccessGuard, RolesGuard } from '../auth/guard';
import { OrderByInput, PaginationCursorInput, PaginationInput } from '../users/dto';
import { PostCreateInput, PostUpdateInput } from './dto';
import { PostsService } from './posts.service';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR, Role.WRITER)
  @Mutation('createPost')
  create(@Args('createPostInput') createPostInput: PostCreateInput, @CurrentUser() user: UserDto) {
    return this.postsService.create(createPostInput, user);
  }

  @Query('posts')
  findAll(
    @Args('pagination') pagination: PaginationCursorInput,
    @Args('tagName') tagName?: string,
    @Args('search') search?: string,
  ) {
    return this.postsService.findAll(pagination, tagName, search);
  }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR, Role.WRITER)
  @Query('posts')
  findAllPosts(
    @Args('pagination') pagination: PaginationInput,
    @Args('orderBy') orderBy?: OrderByInput,
    @Args('topicId') topicId?: number
  ) {
    return this.postsService.findPosts(pagination, orderBy, topicId);
  }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR, Role.WRITER)
  @Query('post')
  findOne(@Args('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Query('postBySlug')
  postBySlug(@Args('date') date: Date, @Args('slug') slug: string) {
    return this.postsService.findBySlug(date, slug);
  }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR, Role.WRITER)
  @Mutation('updatePost')
  update(@Args('updatePostInput') updatePostInput: PostUpdateInput) {
    return this.postsService.update(updatePostInput);
  }

  @UseGuards(AccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR, Role.WRITER)
  @Mutation('removePost')
  remove(@Args('id') id: number) {
    return this.postsService.remove(id);
  }
}
