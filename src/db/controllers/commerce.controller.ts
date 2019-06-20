import { AbstractController } from '@controllers';
import { CommerceModel } from '@db/models';

export class CommerceController extends AbstractController<CommerceModel> {
  constructor() {
    super(CommerceModel);
  }
}