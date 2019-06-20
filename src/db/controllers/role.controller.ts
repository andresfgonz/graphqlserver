import { AbstractController } from './abstract.controller';
import { Role } from '../../types';
import { RoleModel } from '../models/role.model';
import { Document } from 'mongoose';

export class RoleController extends AbstractController<Role & Document> {
  constructor() {
    super(RoleModel);
  }

  getUserRoles(roleIds: string[]): Promise<RoleModel[]> {
    return this.model.find({ _id: { $in: roleIds}}).exec();
  }
}