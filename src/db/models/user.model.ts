import { Schema, model, Document } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { User } from '@appTypes';

export interface UserModel extends User, Document {
  validatePassword(password: string): boolean;

  fullname: string;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'role' }],
  profileImage: new Schema({
    name: { type: String, default: 'user' },
    extension: { type: String, default: 'png' },
  }),
  deviceToken: { type: String, default: null },
});

userSchema.virtual('fullname').get(function () {
  return `${this.name} ${this.lastname}`;
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await hash(this.get('password'), 10);
    this.set('password', hashedPassword);
  }

  next();
});

userSchema.methods.validatePassword = async function (password: string) {
  return await compare(password, this.get('password'));
};

export const UserModel = model<UserModel>('user', userSchema);