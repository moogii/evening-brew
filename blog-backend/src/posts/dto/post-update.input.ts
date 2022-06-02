import { PostCreateInput } from './post-create.input';
import { PartialType } from '@nestjs/mapped-types';

export class PostUpdateInput extends PartialType(PostCreateInput) {
  id: number;
}
