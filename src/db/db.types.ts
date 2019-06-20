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
} from '@controllers';

export type DbConfig = {
  host: string;
  port: string | number;
  dbname: string;
}

export type DBControllers = {
  userController: UserController;
  roleController: RoleController;
  chatController: ChatController;
  chatMessageController: ChatMessageController;
  availabilityController: AvailabilityController;
  commerceController: CommerceController;
  subsidiaryController: SubsidiaryController;
  issueController: IssueController;
  commercePriorityController: CommercePriorityController;
  serviceController: ServiceController;
}
