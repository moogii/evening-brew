import { ForbiddenException, Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { TagCreateInput, TagUpdateInput } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) { }
  async create(input: TagCreateInput): Promise<Tag> {
    try {
      const tag = await this.prisma.tag.create({
        data: {
          name: input.name.trim(),
        },
      });
      return tag;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('Tag exists')
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.tag.findMany({});
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({
      where: { id }
    });
  }

  update(input: TagUpdateInput) {
    const { id, ...updateInput } = input;
    return this.prisma.tag.update({
      where: { id },
      data: updateInput,
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({
      where: { id }
    });
  }
}
