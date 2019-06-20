import { ChatMessage } from '@appTypes';
import { Document, model, Schema } from 'mongoose';

export interface ChatMessageModel extends ChatMessage, Document {}

const chatMessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'chat', required: true },
  createdAt: { type: Date, default: Date.now },
  sender: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  content: { type: String, required: true },
});

export const ChatMessageModel = model<ChatMessageModel>('chatMessage', chatMessageSchema);
