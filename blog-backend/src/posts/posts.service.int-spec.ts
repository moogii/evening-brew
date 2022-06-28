import { Test, TestingModule } from '@nestjs/testing';
import { Post } from '@prisma/client';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.cleanDb();
  });

  let post: Post;

  describe('create', () => {

    it('should create a post', async () => {
      const [topic, user] = await prisma.$transaction([
        prisma.topic.create({
          data: {
            name: 'topic1',
            slug: 'topic1',
          }
        }),
        prisma.user.create({
          data: {
            email: 'admin@admin.com',
            hash: 'admin',
            image: {
              create: {
                full: '',
                thumb: '',
              }
            },
            roles: {
              create: {
                name: 'admin'
              }
            },
            lastName: 'admin',
            firstName: 'admin',
            twitter: '',
          },
        })
      ])

      const dto = {
        title: 'Test',
        slug: 'test',
        content: 'Test',
        topicId: topic.id,
        isOnWeb: true,
      };

      const newPost = await service.create(
        dto, {
        id: user.id,
        hashIt: 1,
        roles: ['admin'],
      });

      post = newPost;

      expect(newPost).toMatchObject(dto);
    });


  });

  describe('findAll', () => {
    it('should paginate posts with cursor', async () => {
      const posts = await service.findAll({
        take: 12,
      });

      expect(posts.length).toBeGreaterThan(0);
    });

    it('should paginate posts with offset', async () => {
      const posts = await service.findPosts({
        take: 12,
        skip: 0,
      });

      expect(posts.list.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should find a post', async () => {
      const oldPost = await service.findOne(post.id);

      expect(oldPost).toMatchObject({
        id: post.id,
      });
    });

    it('should get null if post not found', async () => {
      const post = await service.findOne(0);

      expect(post).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      expect(await service.update({
        id: post.id,
        title: 'Updated',
      })).toMatchObject({ title: 'Updated' });
    });

    it('should throw an error if post is not found', async () => {
      await expect(service.update({ id: 0 })).rejects.toThrow();
    });
  });

  describe('findBySlug', () => {
    it('should find a post', async () => {
      const publishedPost = await prisma.post.update({
        where: { id: post.id },
        data: {
          publishedAt: new Date(),
        },
      });
      const foundPost = await service.findBySlug(publishedPost.publishedAt, 'test');

      expect(foundPost).toMatchObject({
        id: post.id,
      });
    });

    it('should get null if post not found', async () => {
      const post = await service.findBySlug(new Date(), 'test-not-found');

      expect(post).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      await service.remove(post.id);

      const empty = await service.findOne(post.id);
      expect(empty).toBeNull();
    });
  });
});
