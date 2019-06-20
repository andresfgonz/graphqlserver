import { Args, Ctx, Mutation, Resolver } from 'type-graphql/dist';
import { Context } from '@graphql/types';
import { sign } from 'jsonwebtoken';
import { LoginArgs, LoginResponse } from '@schema/auth/auth.types';

@Resolver()
export class AuthSchemaResolver {

  @Mutation(returns => LoginResponse)
  async loginUser(
    @Args() { username, password }: LoginArgs,
    @Ctx() ctx: Context,
  ): Promise<LoginResponse> {
    const { userController } = ctx.controllers;
    const user = await userController.validateUser(username, password);
    if (user) {
      const jwtToken = sign({ userId: user.id }, 'Secure4me');
      return { jwtToken, user };
    } else {
      throw new Error('Wrong username and/or password');
    }
  }
}