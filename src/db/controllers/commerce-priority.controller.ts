import { AbstractController } from '@controllers';
import { CommercePriorityModel } from '@db/models';

export class CommercePriorityController extends AbstractController<CommercePriorityModel> {
  constructor() {
    super(CommercePriorityModel);
  }
}
