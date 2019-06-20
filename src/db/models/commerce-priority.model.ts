import { Schema, model, Document } from 'mongoose';
import { CommercePriority } from '@appTypes';

export interface CommercePriorityModel extends CommercePriority, Document {}

const commerceTypeSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

export const CommercePriorityModel = model<CommercePriorityModel>('commerceType', commerceTypeSchema);
