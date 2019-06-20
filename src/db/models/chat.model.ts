import { Schema, model, Document } from 'mongoose';
import { Chat } from '@appTypes';

export interface ChatModel extends Chat, Document {}

const chatSchema = new Schema({
  active: { type: Boolean, required: true },
  expired: { type: Boolean, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  supportUser: { type: Schema.Types.ObjectId, ref: 'user' },
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
});

export const ChatModel = model<ChatModel>('chat', chatSchema);
