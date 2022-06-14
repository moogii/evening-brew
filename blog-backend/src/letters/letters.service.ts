import { Injectable } from '@nestjs/common';
import { UserDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationCursorInput, PaginationInput } from '../users/dto';
import { LetterCreateInput, LetterUpdateInput } from './dto';

@Injectable()
export class LettersService {
  constructor(private prisma: PrismaService) { }
  create(createLetterInput: LetterCreateInput, user: UserDto) {
    const { posts, ...letter } = createLetterInput;
    return this.prisma.letter.create({
      data: {
        ...letter,
        editorId: user.id,
        topicId: 2,
        posts: {
          connect: posts,
        },
      },
    });
  }

  findAll(topicId: number, pagination: PaginationCursorInput) {
    const { cursor, take = 10 } = pagination;
    return this.prisma.letter.findMany({
      where: {
        publishedAt: {
          not: null,
        },
        topicId,
      },
      orderBy: {
        'publishedAt': 'desc',
      },
      take,
      cursor: {
        'slug': cursor,
      },
      skip: cursor ? 1 : 0,
    });
  }

  async findForPanel(pagination: PaginationInput) {
    const { skip = 0, take = 30 } = pagination;
    const [total, list] = await this.prisma.$transaction([
      this.prisma.letter.count(),
      this.prisma.letter.findMany({
        where: {
          publishedAt: {
            not: null,
          },
        },
        include: {
          data: true,
          editor: true,
        },
        orderBy: {
          'createdAt': 'desc',
        },
        take,
        skip,
      })
    ]);
    return { total, list };
  }

  findOne(id: number) {
    return this.prisma.letter.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          include: {
            image: true
          }
        },
        sponsorImage: true,
        image: true,
        editor: true,
      }
    })
  }

  update(id: number, updateLetterInput: LetterUpdateInput, user: UserDto) {
    const { posts, ...letter } = updateLetterInput;
    return this.prisma.letter.update({
      where: { id },
      data: {
        ...letter,
        editorId: user.id,
        posts: {
          connect: posts,
        }
      }
    })
  }

  remove(id: number) {
    return this.prisma.letter.delete({ where: { id } });
  }
}
