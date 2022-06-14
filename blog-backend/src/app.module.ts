import { Module } from '@nestjs/common';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { TopicActionsModule } from './topic-actions/topic-actions.module';
import { ImagesModule } from './images/images.module';
import { Upload } from './scalars';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { LettersModule } from './letters/letters.module';
import { LetterActionsModule } from './letter-actions/letter-actions.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ['./**/*.graphql'],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      driver: ApolloDriver,
      resolvers: {
        DateTime: GraphQLISODateTime,
      },
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Upload,
    AuthModule,
    UsersModule,
    PrismaModule,
    MailModule,
    PostsModule,
    TagsModule,
    SubscribersModule,
    TopicActionsModule,
    ImagesModule,
    LettersModule,
    LetterActionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor() {
    this.createDirs();
  }

  createDirs() {
    const images = join(__dirname, '..', 'images');

    if (!existsSync(images)) {
      mkdirSync(images);
    }

  }
}
