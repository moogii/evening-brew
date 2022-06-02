import { AuthInput as SignUpQl } from "../../graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthInput extends SignUpQl {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

}
