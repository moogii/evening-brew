import { IsEmail, IsNumber, IsOptional } from "class-validator";
import { CreateSubscriberInput } from "../../graphql";

export class SubscriberCreateInput extends CreateSubscriberInput {
  @IsEmail('Email address is invalid')
  email: string;

  @IsNumber()
  topicId: number;

  @IsNumber()
  @IsOptional()
  referrerrId?: number;
}
