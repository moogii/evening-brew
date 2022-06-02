import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TagCreateInput, TagUpdateInput } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) { }
  create(input: TagCreateInput) {
    return this.prisma.tag.create({
      data: {
        name: input.name.trim(),
      },
    });
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
