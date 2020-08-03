import { AbstractController } from '@db/controllers';
import { ChatModel } from '@db/models';
import { ChatMessage, User } from '@appTypes';

export class ChatController extends AbstractController<ChatModel> {
  constructor() {
    super(ChatModel);
  }

  getUserChats(userId: string): Promise<ChatModel[]> {
    return this.model.find({ user: userId }).exec();
  }

  activateChat(chatId: string): Promise<ChatModel> {
    return this.model.findByIdAndUpdate(chatId, {
      active: true,
    }, { new: true }).exec();
  }

  finalizeChat(chatId: string): Promise<ChatModel> {
    return this.model.findByIdAndUpdate(chatId, {
      active: false,
      expired: true,
    }, { new: true }).exec();
  }

  getCurrentChat(userId: string): Promise<ChatModel> {
    return this.model.findOne({ user: userId, expired: false }).exec();
  }

  getActiveChat(userId: string): Promise<ChatModel> {
    return this.model.findOne({ supportUser: userId, active: true, expired: false }).exec();
  }

  getPendingChats(): Promise<ChatModel[]> {
    return this.model.find({ active: false, expired: false }).exec();
  }

  getUserExpiredChats(user: string): Promise<ChatModel[]> {
    return this.model.find({ user, expired: true })
      .sort({ expiredAt: 'desc' })
      .exec();
  }

  setChatSupportUser(chatId: string, supportUser: string): Promise<ChatModel> {
    return this.model.findByIdAndUpdate(chatId, {
      supportUser,
      active: true,
    }, { new: true }).exec();
  }

  getPopulatedChat(chatId: string): Promise<ChatModel> {
    return this.model.findById(chatId).populate(['user', 'supportUser']).exec();
  }
}
