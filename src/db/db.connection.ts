import { connect } from 'mongoose';
import {
  AvailabilityController,
  ChatController,
  ChatMessageController,
  CommerceController,
  CommercePriorityController,
  IssueController,
  RoleController,
  ServiceController,
  SubsidiaryController,
  UserController,
} from '@db/controllers';
import { DbConfig, DBControllers } from '@db/db.types';

export class DbConnection {
  public controllers: DBControllers;

  constructor(private config: DbConfig) {
    this.controllers = {
      userController: new UserController(),
      roleController: new RoleController(),
      chatController: new ChatController(),
      chatMessageController: new ChatMessageController(),
      availabilityController: new AvailabilityController(),
      commerceController: new CommerceController(),
      subsidiaryController: new SubsidiaryController(),
      issueController: new IssueController(),
      commercePriorityController: new CommercePriorityController(),
      serviceController: new ServiceController(),
    };
  }

  connect() {
    const { host, port, dbname } = this.config;
    const url = `mongodb://${host}:${port}/${dbname}`;
    return connect(url, { useNewUrlParser: true, useCreateIndex: true });
  }
}
