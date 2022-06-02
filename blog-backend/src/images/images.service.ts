import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, unlinkSync } from 'fs';
import { FileUpload } from 'graphql-upload';
import { nanoid } from 'nanoid';
import * as path from 'path';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { ImageUpdateInput } from './dto';

@Injectable()
export class ImagesService {
  s3client = null;
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.s3client = new S3Client({
      region: config.get('AWS_REGION'),
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      }
    });
  }

  getExtension(filename: string): string {
    return filename.split('.').pop() || ''
  }

  checkMime(mimetype: string): boolean {
    return mimetype === 'image/jpeg' ||
      mimetype === 'image/jpg' ||
      mimetype === 'image/png' ||
      mimetype === 'image/gif' ? true : false
  }

  async uploadToS3(name: string, dir: string, file: Buffer) {
    await this.s3client.send(new PutObjectCommand({
      Bucket: this.config.get('AWS_BUCKET'),
      Key: `${dir}/${name}`,
      Body: file,
    }));
  }

  async upload(file: FileUpload) {
    const { createReadStream, filename, mimetype } = file;

    if (!this.checkMime(mimetype)) {
      throw new ForbiddenException('Accepts png, jpg or gif');
    }

    const extension = this.getExtension(filename);

    const newName = `${nanoid()}.${extension}`
    const imgDir = path.join(__dirname, '..', '..', 'images');


    try {

      await new Promise(async (resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(`${imgDir}/${filename}`))
          .on('finish', () => resolve(true))
          .on('error', (e) => reject(e));
      });

      const resized = await sharp(`${imgDir}/${filename}`)
        .resize({
          width: 2000,
          height: 2000,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .withMetadata()
        .toBuffer();

      await this.uploadToS3(newName, 'full', resized);

      const thumb = await sharp(`${imgDir}/${filename}`)
        .resize({
          width: 1000,
          height: 1000,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .withMetadata()
        .toBuffer();

      await this.uploadToS3(newName, 'thumb', thumb);

      await unlinkSync(`${imgDir}/${filename}`)


      return this.prisma.image.create({
        data: {
          full: `https://${this.config.get('AWS_BUCKET')}.s3.${this.config.get('AWS_REGION')}.amazonaws.com/full/${newName}`,
          thumb: `https://${this.config.get('AWS_BUCKET')}.s3.${this.config.get('AWS_REGION')}.amazonaws.com/thumb/${newName}`,
        }
      })
    } catch (e) {
      await unlinkSync(`${imgDir}/${filename}`)
      throw new InternalServerErrorException(e);
    }
  }

  updateImage(input: ImageUpdateInput) {
    return this.prisma.image.update({
      where: { id: input.id },
      data: {
        source: input.source,
      }
    });
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return this.prisma.image.findUnique({
      where: { id }
    });
  }

  async remove(id: number) {
    const image = await this.prisma.image.delete({
      where: { id }
    });

    const name = image.full.split('/').pop();

    await this.s3client.send(new DeleteObjectCommand({
      Bucket: this.config.get('AWS_BUCKET'),
      Key: `full/${name}`,
    }));

    await this.s3client.send(new DeleteObjectCommand({
      Bucket: this.config.get('AWS_BUCKET'),
      Key: `thumb/${name}`,
    }));

    return image;
  }
}
