import { Schema, model, Document, Model } from 'mongoose';
import { Role } from '@appTypes';

export type RoleModel = Role & Document;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const RoleModel: Model<RoleModel, {}> = model('role', roleSchema);