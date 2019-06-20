import { Field, ID, InputType, ObjectType } from 'type-graphql/dist';
import { Image, User } from '@appTypes';
import { RoleType } from '@schema/role/role.type';

@ObjectType()
export class UserType implements User {
  @Field(type => ID) id?: any;
  @Field() name: string;
  @Field() lastname: string;
  @Field() username: string;
  @Field() fullname: string;
  @Field() email: string;
  @Field(type => [RoleType]) roles?: string[];
  @Field(type => String, { nullable: true }) profileImage?: string | Image;
}

@InputType()
class ProfileImage implements Image {
  @Field() extension: string;
  @Field() name: string;
}

@InputType()
export class AddUserInput implements Partial<UserType> {
  @Field() name: string;
  @Field() lastname: string;
  @Field() email: string;
  @Field() username: string;
  @Field() password: string;
  @Field(type => ProfileImage) profileImage: Image;
}