import { Schema, model, Document } from 'mongoose';
import { Service } from '@appTypes';

export interface ServiceModel extends Service, Document {}

const serviceSchema = new Schema({
  scheduledTime: { type: Date },
  subsidiary: { type: Schema.Types.ObjectId, ref: 'subsidiary' },
  issues: [{ type: Schema.Types.ObjectId, ref: 'issue' }],
  technician: { type: Schema.Types.ObjectId, ref: 'user' },
  creationComments: { type: String, required: true },
  status: { type: String, default: 'Creado' },
  active: { type: Boolean, default: false },
});

export const ServiceModel = model<ServiceModel>('service', serviceSchema);
