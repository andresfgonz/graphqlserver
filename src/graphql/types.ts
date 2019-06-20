import { User } from '@appTypes';
import { DBControllers } from '@db/db.types';

export interface Context {
  user: User;
  controllers: DBControllers;
}