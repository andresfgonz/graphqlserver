import { AbstractController } from '@controllers';
import { IssueModel } from '@db/models';

export class IssueController extends AbstractController<IssueModel> {
  constructor() {
    super(IssueModel);
  }
}
