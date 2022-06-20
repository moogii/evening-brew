import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        }
      }
    });
  }

  // for testing purpose
  cleanDb() {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');
    return Promise.all(models.map(async (model) => {
      try {
        await this[model].deleteMany()
      } catch (e) {
        // console.log(e)
      }
    }));
  }
}
