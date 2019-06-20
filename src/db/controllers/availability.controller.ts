import { AbstractController } from '@controllers';
import { AvailabilityModel } from '@db/models';

export class AvailabilityController extends AbstractController<AvailabilityModel> {
  constructor() {
    super(AvailabilityModel);
  }

  async getAvailableUserId(): Promise<string> {
    const availableUsers = await this.model.find({ available: true }).exec();
    const availableUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    return availableUser ? <string>availableUser.user : null;
  }

  async setUserAvailability(user: string, available: boolean): Promise<void> {
    await this.model.findOneAndUpdate({ user }, { available }).exec();
  }
}