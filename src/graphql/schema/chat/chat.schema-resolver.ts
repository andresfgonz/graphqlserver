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
import { ChatInitializedArgsType, ChatType, UserChatsType } from '@schema/chat';
import { UserType } from '@schema/user';
import { ActionResult } from '@schema/schema.defs';
import { Context } from '@graphql/types';
import { SubscriptionTopics } from '@graphql/config';
import { Chat, User } from '@appTypes';

@Resolver(ChatType)
export class ChatSchemaResolver {
  @Query(() => [ChatType])
  chats(@Ctx() ctx: Context): Promise<Chat[]> {
    const { chatController } = ctx.controllers;
    return chatController.findAll();
  }

  @Query(() => UserChatsType)
  async userChats(@Ctx() { user, controllers }: Context): Promise<UserChatsType> {
    const { id: userId } = user;

    const { chatController } = controllers;
    const currentChat = await chatController.getCurrentChat(userId);
    const expiredChats = await chatController.getUserExpiredChats(userId);

    return {
      currentChat,
      expiredChats,
    }
  }

  @Query(returns => [ChatType])
  inactiveChats(@Ctx() ctx: Context): Promise<Chat[]> {
    const { chatController } = ctx.controllers;
    return chatController.getPendingChats();
  }

  @Query(returns => ChatType, { nullable: true })
  activeChat(@Ctx() { user, controllers }: Context): Promise<Chat> {
    const { chatController } = controllers;
    return chatController.getActiveChat(user.id);
  }


  @Mutation(returns => ChatType)
  async createChat(
    @Ctx() { user, controllers }: Context,
    @PubSub(SubscriptionTopics.UserChatCreated) publish: Publisher<Chat>,
    @PubSub(SubscriptionTopics.ChatAsigned) publishChatAsigned: Publisher<Chat>,
  ): Promise<Chat> {
    const { id: userId } = user;
    const { chatController, availabilityController } = controllers;
    const supportUser = await availabilityController.getAvailableUserId();

    const chat = await chatController.create({
      user: userId,
      supportUser,
      active: supportUser !== null,
      expired: false,
    });

    if (supportUser) {
      await availabilityController.setUserAvailability(supportUser, false);
      await publishChatAsigned(chat);
    }

    await publish(chat);
    return chat;
  }

  @Mutation(returns => ActionResult)
  async activateChat(
    @Arg('chatId') chatId: string,
    @Ctx() { user, controllers }: Context,
    @PubSub(SubscriptionTopics.ChatInitialized) publish: Publisher<Chat>,
  ): Promise<ActionResult> {
    const { chatController } = controllers;
    const activedChat = await chatController.activateChat(chatId);

    await publish(activedChat);

    return {
      success: true,
      message: `Chat(${chatId}) successfuly activated`,
    };
  }

  @Mutation(returns => ActionResult)
  async finalizeChat(
    @Arg('chatId') chatId: string,
    @Ctx() { user, controllers }: Context,
    @PubSub(SubscriptionTopics.ChatAsigned) publishChatAsigned: Publisher<Chat>,
    @PubSub(SubscriptionTopics.ChatExpired) publishChatExpired: Publisher<Chat>,
    @PubSub(SubscriptionTopics.ChatInitialized) publishChatInitialized: Publisher<Chat>,
  ): Promise<ActionResult> {
    const { chatController, availabilityController } = controllers;
    const expiredChat = await chatController.finalizeChat(chatId);

    await publishChatExpired(expiredChat);

    const pendingChats = await chatController.getPendingChats();

    if (pendingChats.length) {
      const pendingChat = pendingChats.shift();
      const asignedChat = await chatController.setChatSupportUser(pendingChat.id, user.id);
      await publishChatAsigned(asignedChat);
      await publishChatInitialized(asignedChat);
    } else {
      await availabilityController.setUserAvailability(user.id, true);
    }

    return {
      success: true,
      message: `Chat(${chatId}) successfuly expired`,
    };
  }


  @FieldResolver(returns => UserType)
  user(@Root() { user }: Chat, @Ctx() { controllers }: Context): Promise<User> {
    return controllers.userController.findbyId(<string>user);
  }

  @FieldResolver(returns => UserType)
  supportUser(@Root() { supportUser }: Chat, @Ctx() ctx: Context): Promise<User> {
    const { userController } = ctx.controllers;
    return userController.findbyId(<string>supportUser);
  }

  @Subscription(returns => ChatType, { topics: SubscriptionTopics.ChatInitialized })
  chatInitializedSubscription(@Root() chat: Chat): Chat {
    return chat;
  }

  @Subscription(returns => ChatType, {
    topics: SubscriptionTopics.UserChatCreated,
    filter(data: ResolverFilterData<Chat, {}, Context>) {
      const { payload: { user }, context: { user: sessionUser } } = data;
      return user == sessionUser.id;
    },
  })
  userChatCreated(@Root() chat: Chat): Chat {
    return chat;
  }

  @Subscription(returns => ChatType, { topics: SubscriptionTopics.ChatCreated })
  chatCreated(@Root() chat: Chat): Chat {
    return chat;
  }

  @Subscription(returns => ChatType, {
    topics: SubscriptionTopics.ChatAsigned,
    filter(data: ResolverFilterData<Chat, {}, Context>) {
      const { payload: { supportUser }, context: { user } } = data;
      return supportUser == user.id;
    },
  })
  chatAsigned(@Root() chat: Chat): Chat {
    return chat;
  }

  @Subscription(returns => ChatType, {
    topics: SubscriptionTopics.ChatExpired,
    filter(data: ResolverFilterData<Chat, {}, Context>) {
      const { payload: { user, supportUser }, context: { user: sessionUser } } = data;
      return user == sessionUser.id || supportUser == sessionUser.id
    },
  })
  chatExpired(@Root() chat: Chat): Chat {
    return chat;
  }
}