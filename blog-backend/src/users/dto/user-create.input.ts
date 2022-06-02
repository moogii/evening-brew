import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import { CreateUserInput, IdInput } from "../../graphql";

export class UserCreateInput extends CreateUserInput {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @IsOptional()
  roles?: IdInput[];

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

}