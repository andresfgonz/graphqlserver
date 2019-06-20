import { User } from '@appTypes';
import { UserModel } from '@db/models';
import { AbstractController } from './abstract.controller';

export class UserController extends AbstractController<UserModel> {
  constructor() {
    super(UserModel);
  }

  createUser(user: Partial<User>): Promise<User> {
    return new this.model(user).save();
  }

  async addUserRole(userId: string, roleId: string): Promise<User> {
    return this.model.findByIdAndUpdate(userId, { $addToSet: { roles: roleId } });
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.model.findOne({ username }).exec();
    if (!user) return null;
    return await user.validatePassword(password) ? user : null;
  }

  async setUserDeviceToken(userId: string, deviceToken: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { deviceToken }).exec();
  }

  getTechnicians(): Promise<User[]> {
    return this.model.find({ roles: '5ca9409bc3f5020ad6aeb3a7' }).exec();
  }
}
