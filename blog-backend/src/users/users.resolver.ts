import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserUpdateInput, OrderByInput, PaginationInput, UserCreateInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { AccessGuard, RolesGuard } from '../auth/guard';
import { CurrentUser, Roles } from '../auth/decorator';
import { Role } from '../auth/entities';
import { UserDto } from '../auth/dto';

@UseGuards(AccessGuard, RolesGuard)
@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Roles(Role.ADMIN)
  @Mutation('createUser')
  createUser(@Args('createUserInput') input: UserCreateInput) {
    return this.usersService.create(input);
  }

  @Roles(Role.ADMIN)
  @Query('users')
  findAll(@Args('orderBy') orderBy?: OrderByInput, @Args('pagination') pagination?: PaginationInput) {
    return this.usersService.findAll(orderBy, pagination);
  }

  @Query('user')
  findOne(@Args('id') id: number, @CurrentUser() userDto: UserDto) {
    return this.usersService.findOne(id, userDto);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') input: UserUpdateInput, @CurrentUser() userDto: UserDto) {
    return this.usersService.update(input, userDto);
  }

  @Mutation('confirmEmail')
  confirmEmail(@Args('token') token: string, @CurrentUser() userDto: UserDto) {
    return this.usersService.confirmEmail(token, userDto);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.usersService.remove(id);
  }
}
