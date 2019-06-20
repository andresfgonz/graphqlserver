import { Chat, User } from '@appTypes';
import { ArgsType, Field, ID, ObjectType } from 'type-graphql/dist';
import { UserType } from '@schema/user';

@ObjectType()
export class ChatType implements Chat {
  @Field(() => ID) id?: any;
  @Field() createdAt: Date;
  @Field() expiredAt: Date;
  @Field() active: boolean;
  @Field() expired: boolean;
  @Field(() => UserType) user: User;
  @Field(() => UserType, { nullable: true }) supportUser: User;
}

@ArgsType()
export class ChatInitializedArgsType {
  @Field() chatId: string;
}

@ArgsType()
export class ChatCreatedSubArgsType {
  @Field() userId: string;
}

@ObjectType()
export class UserChatsType {
  @Field(() => ChatType, { nullable: true }) currentChat: Chat;
  @Field(() => [ChatType]) expiredChats: Chat[];
}