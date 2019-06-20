import { AbstractController } from '@controllers';
import { SubsidiaryModel } from '@db/models';

export class SubsidiaryController extends AbstractController<SubsidiaryModel> {
  constructor() {
    super(SubsidiaryModel);
  }

  getSubsidiaryByPerson(userId: string): Promise<SubsidiaryModel> {
    return this.model.findOne({ personInCharge: userId }).exec();
  }

  getCommerceSubsidiaries(commerceId: string): Promise<SubsidiaryModel[]> {
    return this.model.find({ commerce: commerceId }).exec();
  }
}
