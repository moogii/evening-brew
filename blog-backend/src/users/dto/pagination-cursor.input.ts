import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationCursorParams } from "../../graphql";

export class PaginationCursorInput extends PaginationCursorParams {
  @IsNumber()
  @IsOptional()
  take?: number;

  @IsString()
  @IsOptional()
  cursor?: string;
}