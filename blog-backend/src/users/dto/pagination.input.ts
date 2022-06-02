import { IsNumber, IsOptional } from "class-validator";
import { PaginationParams } from "../../graphql";

export class PaginationInput extends PaginationParams {
  @IsNumber()
  @IsOptional()
  take?: number;

  @IsNumber()
  @IsOptional()
  skip?: number;
}