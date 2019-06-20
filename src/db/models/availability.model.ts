import { Schema, model, Document } from 'mongoose';
import { Interface } from 'readline';
import { Availability } from '@appTypes';

export interface AvailabilityModel extends Availability, Document {}

const availabilitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', unique: true },
  available: { type: Boolean, default: true },
}, { collection: 'availability' });

export const AvailabilityModel =
  model<AvailabilityModel>('availability', availabilitySchema);