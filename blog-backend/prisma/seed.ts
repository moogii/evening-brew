import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();


// topics, roles and admin should be created in seed
async function main() {
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  const password = await argon.hash('password');

  const user = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      firstName: 'admin',
      lastName: 'admin',
      hash: password,
      twitter: '',
      active: true,
      roles: {
        create: [{
          name: 'admin',
        }, {
          name: 'editor',
        }, {
          name: 'writer',
        }]
      }
    }
  });

  await prisma.topic.createMany({
    data: [{
      name: 'JavaScript',
      slug: 'javascript',
    }, {
      name: 'TypeScript',
      slug: 'typescript',
    }]
  })
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();