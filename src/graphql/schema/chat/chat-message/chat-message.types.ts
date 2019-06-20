import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql/dist';
import { Chat, ChatMessage, User } from '@appTypes';
import { UserType } from '@schema/user';
import { ChatType } from '@schema/chat';

@ObjectType()
export class ChatMessageType implements ChatMessage {
  @Field(() => ID) id?: any;
  @Field(() => ChatType) chat: Chat;
  @Field() content: string;
  @Field() createdAt: Date;
  @Field(() => UserType) sender: User;
}

@InputType()
export class MessageInputType implements Partial<ChatMessage> {
  @Field() sender: string;
  @Field() content: string;
}

@ArgsType()
export class ChatMessageSubArgs {
  @Field() chatId: string;
}