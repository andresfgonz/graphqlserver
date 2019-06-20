import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql/dist';
import { RoleType } from './role.type';
import { Role } from '../../../types';
import { Context } from '../../types';
import { Document } from 'mongoose';

@Resolver(RoleType)
export class RoleSchemaResolver {
  @Query(returns => [RoleType])
  roles(@Ctx() { controllers }: Context): Promise<Role[]> {
    return controllers.roleController.findAll();
  }

  @Mutation(returns => RoleType)
  addRole(@Arg('name') name: string, @Ctx() { controllers }: Context): Promise<Role> {
    return controllers.roleController.create({ name });
  }

  @Mutation(returns => Boolean)
  async removeRole(@Arg('roleId') roleId: string, @Ctx() { controllers }: Context) {
    const role = await controllers.roleController.delete(roleId);
    if(!role){
      throw new Error('Role does not exist');
    }
    return true;
  }
}