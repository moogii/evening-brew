import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TagsService>(TagsService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  })

  describe('create', () => {
    it('should create a tag', async () => {
      const tag = await service.create({
        name: 'Test tag',
      });

      expect(tag).toMatchObject({ name: 'Test tag' });
    });

    it('should not create a tag with the same name', async () => {
      try {
        await service.create({
          name: 'Test tag',
        })
      } catch (error) {
        expect(error).toMatchObject({ message: 'Tag exists' });
      }
    });
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      const tags = await service.findAll();

      expect(tags.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a tag', async () => {
      const tag = await prisma.tag.findFirst({});

      const foundTag = await service.findOne(tag.id);

      expect(foundTag).toMatchObject(tag);
    });

    it('should return null if tag not found', async () => {
      const foundTag = await service.findOne(0);

      expect(foundTag).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const tag = await prisma.tag.findFirst({})

      const updatedTag = await service.update({
        id: tag.id,
        name: 'Test tag updated',
      });

      expect(updatedTag).toMatchObject({
        name: 'Test tag updated',
      });
    });

    it('should throw an error if tag not found', async () => {
      expect(service.update({
        id: 0,
        name: 'Test tag updated',
      })).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const tag = await prisma.tag.findFirst({});
      expect(await service.remove(tag.id)).toEqual(tag)
    });
  });
});
