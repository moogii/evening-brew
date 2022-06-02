import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { TagCreateInput } from './tag-create.input';

export class TagUpdateInput extends PartialType(TagCreateInput) {
  @IsNumber()
  id: number;
}
