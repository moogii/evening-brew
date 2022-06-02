import { IsString } from "class-validator";
import { CreateTagInput } from "../../graphql";

export class TagCreateInput extends CreateTagInput {
  @IsString()
  name: string;
}