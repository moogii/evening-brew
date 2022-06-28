
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class AuthInput {
    email: string;
    password: string;
}

export class ResetPasswordInput {
    id: number;
    token: string;
    password?: Nullable<string>;
}

export class UpdateImageInput {
    id: number;
    source?: Nullable<string>;
}

export class CreateLetterActionInput {
    letterId: number;
    subscriberId: number;
    action: string;
}

export class CreateLetterInput {
    name: string;
    slug: string;
    topicId: number;
    imageId: number;
    sponsorImageId?: Nullable<number>;
    sponsorUrl?: Nullable<string>;
    publishedAt?: Nullable<DateTime>;
    posts?: Nullable<Nullable<IdInput>[]>;
}

export class UpdateLetterInput {
    id: number;
    name?: Nullable<string>;
    slug?: Nullable<string>;
    topicId: number;
    imageId: number;
    sponsorUrl?: Nullable<string>;
    sponsorImageId?: Nullable<number>;
    publishedAt?: Nullable<DateTime>;
    posts?: Nullable<Nullable<IdInput>[]>;
}

export class CreatePostInput {
    title: string;
    slug: string;
    description?: Nullable<string>;
    content: string;
    tagName?: Nullable<string>;
    topicId: number;
    isOnWeb?: Nullable<boolean>;
}

export class UpdatePostInput {
    id: number;
    order?: Nullable<number>;
    title?: Nullable<string>;
    slug?: Nullable<string>;
    description?: Nullable<string>;
    content?: Nullable<string>;
    tagName?: Nullable<string>;
    topicId?: Nullable<number>;
    writerId?: Nullable<number>;
    isOnWeb?: Nullable<boolean>;
}

export class CreateSubscriberInput {
    email: string;
    referrerrId?: Nullable<number>;
    topicId: number;
}

export class CreateTagInput {
    name: string;
}

export class UpdateTagInput {
    id: number;
    name: string;
}

export class IdInput {
    id: number;
}

export class CreateUserInput {
    email: string;
    roles: Nullable<IdInput>[];
    imageId: number;
    firstName: string;
    lastName: string;
    twitter: string;
}

export class UpdateUserInput {
    id: number;
    email?: Nullable<string>;
    imageId?: Nullable<number>;
    active?: Nullable<boolean>;
    roles?: Nullable<Nullable<IdInput>[]>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    oldPassword?: Nullable<string>;
    newPassword?: Nullable<string>;
    twitter?: Nullable<string>;
    hash?: Nullable<string>;
}

export class OrderByParams {
    field?: Nullable<string>;
    direction?: Nullable<string>;
}

export class PaginationCursorParams {
    take?: Nullable<number>;
    cursor?: Nullable<string>;
}

export class PaginationParams {
    take?: Nullable<number>;
    skip?: Nullable<number>;
}

export class Token {
    accessToken: string;
    refreshToken: string;
}

export abstract class IMutation {
    abstract signIn(authInput: AuthInput): Token | Promise<Token>;

    abstract signOut(): Nullable<string> | Promise<Nullable<string>>;

    abstract refresh(): Token | Promise<Token>;

    abstract forgotPassword(email: string): Nullable<string> | Promise<Nullable<string>>;

    abstract resetPassword(resetPasswordInput: ResetPasswordInput): Nullable<string> | Promise<Nullable<string>>;

    abstract uploadImage(file: Upload): Nullable<Image> | Promise<Nullable<Image>>;

    abstract updateImage(updateImageInput: UpdateImageInput): Image | Promise<Image>;

    abstract removeImage(id: number): Nullable<Image> | Promise<Nullable<Image>>;

    abstract createLetterAction(createLetterActionInput: CreateLetterActionInput): LetterAction | Promise<LetterAction>;

    abstract createLetter(createLetterInput: CreateLetterInput): Letter | Promise<Letter>;

    abstract updateLetter(updateLetterInput: UpdateLetterInput): Letter | Promise<Letter>;

    abstract removeLetter(id: number): Nullable<Letter> | Promise<Nullable<Letter>>;

    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract removePost(id: number): Nullable<Post> | Promise<Nullable<Post>>;

    abstract createSubscriber(createSubscriberInput: CreateSubscriberInput): Subscriber | Promise<Subscriber>;

    abstract confirmSubscriber(email: string, token: string): Subscriber | Promise<Subscriber>;

    abstract unsubscriberFromTopic(id: number, topicId: number): Nullable<Subscriber> | Promise<Nullable<Subscriber>>;

    abstract createTag(createTagInput: CreateTagInput): Tag | Promise<Tag>;

    abstract updateTag(updateTagInput: UpdateTagInput): Tag | Promise<Tag>;

    abstract removeTag(id: number): Nullable<Tag> | Promise<Nullable<Tag>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract confirmEmail(token: string): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export class Image {
    id?: Nullable<number>;
    full?: Nullable<string>;
    thumb?: Nullable<string>;
    source?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    user?: Nullable<User>;
    post?: Nullable<Post>;
}

export abstract class IQuery {
    abstract images(): Nullable<Image>[] | Promise<Nullable<Image>[]>;

    abstract image(id: number): Nullable<Image> | Promise<Nullable<Image>>;

    abstract letterList(pagination?: Nullable<PaginationParams>): Letters | Promise<Letters>;

    abstract letters(topicId: number, pagination?: Nullable<PaginationCursorParams>): Nullable<Letter>[] | Promise<Nullable<Letter>[]>;

    abstract letter(id: number): Nullable<Letter> | Promise<Nullable<Letter>>;

    abstract posts(pagination: PaginationCursorParams, tagName?: Nullable<string>, search?: Nullable<string>): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract postsByTopic(pagination: PaginationParams, orderBy?: Nullable<OrderByParams>, topicId?: Nullable<number>): Posts | Promise<Posts>;

    abstract post(id: number): Nullable<Post> | Promise<Nullable<Post>>;

    abstract postBySlug(date: DateTime, slug: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract subscribers(pagination?: Nullable<PaginationParams>, orderBy?: Nullable<OrderByParams>): Subscribers | Promise<Subscribers>;

    abstract subscriber(id: number): Nullable<Subscriber> | Promise<Nullable<Subscriber>>;

    abstract subscriberByEmail(email: string): Nullable<Subscriber> | Promise<Nullable<Subscriber>>;

    abstract tags(): Nullable<Tag>[] | Promise<Nullable<Tag>[]>;

    abstract tag(id: number): Nullable<Tag> | Promise<Nullable<Tag>>;

    abstract users(orderBy?: Nullable<OrderByParams>, pagination?: Nullable<PaginationParams>): Users | Promise<Users>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export class LetterAction {
    letterId?: Nullable<number>;
    letter?: Nullable<Letter>;
    subscriberId?: Nullable<number>;
    subscriber?: Nullable<Subscriber>;
    action?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class LetterData {
    id?: Nullable<number>;
    letterId: number;
    letter?: Nullable<Letter>;
    clicks?: Nullable<number>;
    uniqueClicks?: Nullable<number>;
    opens?: Nullable<number>;
    uniqueOpens?: Nullable<number>;
    recipents?: Nullable<number>;
    views?: Nullable<number>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class Letter {
    id?: Nullable<number>;
    name: string;
    slug: string;
    topicId?: Nullable<number>;
    topic?: Nullable<Topic>;
    editorId?: Nullable<number>;
    editor?: Nullable<User>;
    imageId?: Nullable<number>;
    image?: Nullable<Image>;
    sponsorImageId?: Nullable<number>;
    sponsorImage?: Nullable<Image>;
    sponsorUrl?: Nullable<string>;
    posts?: Nullable<Nullable<Post>[]>;
    data?: Nullable<Nullable<LetterData>[]>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    publishedAt?: Nullable<DateTime>;
}

export class Letters {
    list?: Nullable<Nullable<Letter>[]>;
    total?: Nullable<number>;
}

export class Topic {
    id?: Nullable<number>;
    name?: Nullable<string>;
    slug?: Nullable<string>;
    description?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class Post {
    id?: Nullable<number>;
    title?: Nullable<string>;
    slug?: Nullable<string>;
    order?: Nullable<number>;
    description?: Nullable<string>;
    content?: Nullable<string>;
    views?: Nullable<number>;
    tagName?: Nullable<string>;
    tag?: Nullable<Tag>;
    imageId?: Nullable<number>;
    image?: Nullable<Image>;
    topicId?: Nullable<number>;
    topic?: Nullable<Topic>;
    writerId?: Nullable<number>;
    writer?: Nullable<User>;
    isOnWeb?: Nullable<boolean>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    publishedAt?: Nullable<DateTime>;
}

export class Posts {
    total?: Nullable<number>;
    list?: Nullable<Nullable<Post>[]>;
}

export class Subscriber {
    id?: Nullable<number>;
    email?: Nullable<string>;
    referrals?: Nullable<number>;
    referrerrId?: Nullable<number>;
    referrer?: Nullable<Subscriber>;
    referred?: Nullable<Nullable<Subscriber>[]>;
    topics?: Nullable<Nullable<Topic>[]>;
    topicActions?: Nullable<Nullable<TopicAction>[]>;
    letterActions?: Nullable<Nullable<LetterAction>[]>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class Subscribers {
    total?: Nullable<number>;
    list?: Nullable<Nullable<Subscriber>[]>;
}

export class Tag {
    id?: Nullable<number>;
    name?: Nullable<string>;
}

export class TopicAction {
    id?: Nullable<number>;
    topicId?: Nullable<number>;
    topic?: Nullable<Topic>;
    subscriberId?: Nullable<number>;
    subscriber?: Nullable<Subscriber>;
    action?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class Role {
    id: number;
    name: string;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class User {
    id: number;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email: string;
    active?: Nullable<boolean>;
    role?: Nullable<Nullable<Role>[]>;
    twitter?: Nullable<string>;
    imageId?: Nullable<number>;
    image?: Nullable<Image>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class Users {
    total: number;
    list: Nullable<User>[];
}

export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
