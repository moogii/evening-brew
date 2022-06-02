import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ResetPasswordInput as ResetPasswordInputQl } from "../../graphql";
export class ResetPasswordInput extends ResetPasswordInputQl {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  // optional. Because we can use reset password service to activate account
  @IsString()
  @IsOptional()
  password?: string;
}