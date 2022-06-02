import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IdInput, UpdateUserInput } from "../../graphql";

export class UserUpdateInput extends UpdateUserInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @IsOptional()
  roles?: IdInput[];

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  oldPassword?: string;

  @IsString()
  @IsOptional()
  newPassword?: string;
}
