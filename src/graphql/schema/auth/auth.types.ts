import { ArgsType, Field, ObjectType } from 'type-graphql/dist';
import { UserType } from '@schema/user';

@ObjectType()
export class LoginResponse {
  @Field() jwtToken: string;
  @Field() user: UserType;
}

@ArgsType()
export class LoginArgs {
  @Field() username: string;
  @Field() password: string;
}