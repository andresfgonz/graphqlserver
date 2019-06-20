import { Schema, model, Document } from 'mongoose';
import { Commerce } from '@appTypes';

export interface CommerceModel extends Commerce, Document {}

const commerceSchema = new Schema({
  name: { type: String, required: true },
  tinNumber: { type: String, required: true },
  priority: { type: Schema.Types.ObjectId, ref: 'commerceType' },
  logoImage: new Schema({
    name: { type: String, required: true },
    extension: { type: String, default: 'png' },
  }, { _id: false }),
  geoLocation: new Schema({
    lat: Number,
    lon: Number,
  }, { _id: false }),
});

export const CommerceModel = model<CommerceModel>('commerce', commerceSchema);
