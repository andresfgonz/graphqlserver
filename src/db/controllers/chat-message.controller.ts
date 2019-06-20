import { AbstractController } from '@controllers';
import { ChatMessageModel } from '@db/models/chat-message.model';

export class ChatMessageController extends AbstractController<ChatMessageModel> {
  constructor() {
    super(ChatMessageModel);
  }

  getChatMessages(chat: string): Promise<ChatMessageModel[]> {
    return this.model.find({ chat }).exec();
  }
}