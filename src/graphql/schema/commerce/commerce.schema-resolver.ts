import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql/dist';
import { CommerceInputType, CommerceType } from '@schema/commerce/commerce.type';
import { Context } from '@graphql/types';
import { Commerce, Image } from '@appTypes';
import { resolve } from 'path';
import { readFileSync } from 'fs';

@Resolver(CommerceType)
export class CommerceSchemaResolver {

  @Query(returns => [CommerceType])
  commerces(@Ctx() ctx: Context): Promise<Commerce[]> {
    const { commerceController } = ctx.controllers;
    return commerceController.findAll();
  }

  @Mutation(returns => CommerceType)
  addCommerce(
    @Arg('commerce') commerce: CommerceInputType,
    @Ctx() ctx: Context,
  ) {
    const { commerceController } = ctx.controllers;
    return commerceController.create(commerce);
  }

  @FieldResolver()
  async logoImage(@Root() commerce: Commerce): Promise<string> {
    const { name, extension } = <Image>commerce.logoImage;
    const imagePath = resolve(process.cwd(), 'storage', 'branch-logos', `${name}.${extension}`);
    try {
      const image = readFileSync(imagePath, { encoding: 'base64' });
      return `data:image/png;base64,${image}`;
    } catch (e) {
      return null;
    }
  }

  @FieldResolver()
  priority(@Root() commerce: Commerce, @Ctx() ctx: Context) {
    const { commercePriorityController } = ctx.controllers;
    const { priority } = commerce;
    return commercePriorityController.findbyId(<string>priority);
  }
}
