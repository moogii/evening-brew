import { IsOptional, IsString } from "class-validator";
import { OrderByParams } from "../../graphql";

export class OrderByInput extends OrderByParams {
  @IsString()
  @IsOptional()
  field?: string;

  @IsString()
  @IsOptional()
  direction?: string;
}