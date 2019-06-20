import { Schema, model, Document } from 'mongoose';
import { Subsidiary } from '@appTypes';

export interface SubsidiaryModel extends Subsidiary, Document {}

const subsidiarySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  personInCharge: { type: Schema.Types.ObjectId, ref: 'user' },
  commerce: { type: Schema.Types.ObjectId, ref: 'commerce' },
});

export const SubsidiaryModel =
  model<SubsidiaryModel>('subsidiary', subsidiarySchema);
