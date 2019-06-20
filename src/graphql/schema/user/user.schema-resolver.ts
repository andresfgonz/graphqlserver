import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql/dist';
import { Context } from '@graphql/types';
import { Image, Role, User } from '@appTypes';
import { UserType, AddUserInput } from '@schema/user/user.types';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { ActionResult } from '@schema/schema.defs';

@Resolver(UserType)
export class UserSchemaResolver {
  @Mutation(returns => UserType)
  addUser(@Arg('data') user: AddUserInput, @Ctx() ctx: Context): Promise<UserType> {
    const { userController } = ctx.controllers;
    return userController.createUser(user);
  }

  @Query(returns => UserType)
  user(@Arg('id') id: string, @Ctx() ctx: Context): Promise<UserType> {
    const { userController } = ctx.controllers;
    return userController.findbyId(id);
  }

  @Query(returns => [UserType])
  technicians(@Ctx() ctx: Context){
    const { userController } = ctx.controllers;
    return userController.getTechnicians();
  }

  @Query(returns => [UserType])
  users(@Ctx() ctx: Context): Promise<UserType[]> {
    const { userController } = ctx.controllers;
    return userController.findAll();
  }

  @Mutation(returns => UserType)
  async addRoleToUser(
    @Arg('userId') userId: string,
    @Arg('roleId') roleId: string,
    @Ctx() { controllers }: Context,
  ): Promise<UserType> {
    const { userController, availabilityController, roleController } = controllers;
    const role = await roleController.findbyId(roleId);

    if (role.name === 'SUPPORT') {
      await availabilityController.create({ user: userId });
    }

    return userController.addUserRole(userId, roleId);
  }

  @Mutation(returns => ActionResult)
  async setUserDeviceToken(
    @Arg('deviceToken') deviceToken: string,
    @Ctx() { user, controllers }: Context,
  ): Promise<ActionResult> {
    const { userController } = controllers;
    await userController.setUserDeviceToken(user.id, deviceToken);

    return {
      success: true,
      message: `deviceToken setted to user ${user.fullname}`,
    }
  }

  @FieldResolver()
  roles(@Root() user: User, @Ctx() { controllers }: Context): Promise<Role[]> {
    return controllers.roleController.getUserRoles(user.roles);
  }

  @FieldResolver()
  async profileImage(@Root() user: User): Promise<string> {
    const { name, extension } = <Image>user.profileImage;
    const imagePath = resolve(process.cwd(), 'storage', 'profile-images', `${name}.${extension}`);
    try {
      const image = readFileSync(imagePath, { encoding: 'base64' });
      return `data:image/png;base64,${image}`;
    } catch (e) {
      return null;
    }
  }
}
