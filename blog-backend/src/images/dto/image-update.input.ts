import { IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateImageInput } from "../../graphql";

export class ImageUpdateInput extends UpdateImageInput {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  source?: string;
}