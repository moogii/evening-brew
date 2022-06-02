import { Injectable } from '@nestjs/common';
import { UserDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderByInput, PaginationCursorInput, PaginationInput } from '../users/dto';
import { PostCreateInput, PostUpdateInput } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }
  create(input: PostCreateInput, user: UserDto) {
    return this.prisma.post.create({
      data: {
        ...input,
        writerId: user.id,
      },
    })
  }

  findAll(
    paginatoin: PaginationCursorInput,
    tagName?: string,
    search?: string) {
    const { cursor = undefined, take = 12 } = paginatoin;

    return this.prisma.post.findMany({
      include: {
        image: true,
        writer: true,
      },
      cursor: {
        createdAt: cursor,
      },
      take,
      skip: cursor ? 1 : 0,
      where: {
        AND: [
          {
            content: {
              search: search,
            }
          },
          {
            tagName: tagName,
          }
        ]
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  }

  async findPosts(
    pagination: PaginationInput,
    orderBy: OrderByInput,
    topicId?: number
  ) {
    const { take = 20, skip = 0 } = pagination;
    const { field = 'createdAt', direction = 'desc' } = orderBy;

    const [total, list] = await this.prisma.$transaction([
      this.prisma.post.count(),
      this.prisma.post.findMany({
        where: {
          topicId,
        },
        take,
        skip,
        orderBy: {
          [field]: direction,
        },
      })
    ])

    return {
      total, list
    }
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        image: true,
        writer: true,
        letter: true,
      },
    });
  }

  findBySlug(date: Date, slug: string) {
    return this.prisma.post.findFirst({
      where: {
        slug: slug,
        publishedAt: {
          gte: date,
          lt: new Date(date.getDate() + 1)
        }
      }
    })
  }

  update(input: PostUpdateInput) {
    return this.prisma.post.update({
      where: {
        id: input.id,
      },
      data: input,
    })
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id }
    })
  }
}
