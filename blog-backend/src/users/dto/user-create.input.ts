import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUrl } from "class-validator";
import { CreateUserInput, IdInput } from "../../graphql";

export class UserCreateInput extends CreateUserInput {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  roles: IdInput[];

  @IsString({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Last name is required' })
  lastName: string;

  @IsUrl({ message: 'Twitter is required' })
  twitter: string;

}