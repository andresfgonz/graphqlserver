import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
} from 'type-graphql/dist';
import { UserType } from '@schema/user';
import { ChatMessage, Image, User } from '@appTypes';
import { Context } from '@graphql/types';
import { ChatMessageSubArgs, ChatMessageType, ChatType, MessageInputType } from '@schema/chat';
import { ActionResult } from '@schema/schema.defs';
import { SubscriptionTopics } from '@graphql/config';
import axios from 'axios';
import { resolve } from 'path';
import { readFileSync } from 'fs';

@Resolver(ChatMessageType)
export class ChatMessageSchemaResolver {

  @Query(returns => [ChatMessageType])
  chatMessages(@Arg('chatId') chatId: string, @Ctx() ctx: Context): Promise<ChatMessage[]> {
    const { chatMessageController } = ctx.controllers;
    return chatMessageController.getChatMessages(chatId);
  }

  @Mutation(returns => ActionResult)
  async addChatMessage(
    @PubSub(SubscriptionTopics.ChatMessage) publish: Publisher<ChatMessage>,
    @Arg('chatId') chat: string,
    @Arg('message') content: string,
    @Ctx() { user, controllers }: Context,
  ): Promise<ActionResult> {
    const { chatMessageController, chatController } = controllers;
    const chatMessage = await chatMessageController.create({
      content,
      chat,
      sender: user.id,
    });

    await publish(chatMessage);
    const populatedChat = await chatController.getPopulatedChat(chat);
    const customerUser = <User>populatedChat.user;
    const supportUser = <User>populatedChat.supportUser;

    if (supportUser.id === user.id && customerUser.deviceToken) {
      axios.post('https://exp.host/--/api/v2/push/send', {
        to: customerUser.deviceToken,
        title: supportUser.fullname,
        body: content,
        data: {
          notificationType: 'newChatMessage',
          chat,
          content,
          customerUser: customerUser.id,
          supportUserName: supportUser.fullname,
        },
      });
    }

    return {
      success: true,
      message: `Message successfuly added to chat(${chat})`,
    }
  }

  @FieldResolver(returns => UserType)
  sender(@Root() { sender }: ChatMessage, @Ctx() { controllers }: Context): Promise<User> {
    return controllers.userController.findbyId(<string>sender);
  }

  @FieldResolver(returns => ChatType)
  chat(@Root() { chat }: ChatMessage, @Ctx() ctx: Context) {
    const { chatController } = ctx.controllers;
    return chatController.findbyId(<string>chat);
  }

  @Subscription(returns => ChatMessageType, {
    topics: SubscriptionTopics.ChatMessage,
    filter(data: ResolverFilterData<ChatMessage, ChatMessageSubArgs>) {
      const { payload: { chat }, args: { chatId } } = data;
      return chat == chatId;
    },
  })
  chatMessageSubscription(
    @Args() args: ChatMessageSubArgs,
    @Root() message: ChatMessage): ChatMessage {
    return message;
  }
}