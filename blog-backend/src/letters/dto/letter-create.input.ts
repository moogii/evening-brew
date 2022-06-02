import { IsNumber, IsString } from "class-validator";
import { CreateLetterInput } from "../../graphql";

export class LetterCreateInput extends CreateLetterInput {
  @IsString()
  name: string;

  @IsNumber({}, { message: 'Meta image must be included' })
  imageId: number;

  @IsString({ message: 'Slug must be unique string' })
  slug: string;

  @IsNumber({}, { message: 'Topic must be a number' })
  topicId: number;
}
