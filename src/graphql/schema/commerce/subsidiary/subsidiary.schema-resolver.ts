import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql/dist';
import { Commerce, Subsidiary, User } from '@appTypes';
import { SubsidiaryInputType, SubsidiaryType } from '@schema/commerce/subsidiary/subsidiary.type';
import { Context } from '@graphql/types';

@Resolver(SubsidiaryType)
export class SubsidiarySchemaResolver {

  @Query(returns => [SubsidiaryType])
  subsidiaries(@Ctx() ctx: Context): Promise<Subsidiary[]> {
    const { subsidiaryController } = ctx.controllers;
    return subsidiaryController.findAll();
  }

  @Query(returns => SubsidiaryType)
  subsidiaryByPerson(@Arg('personId') userId: string, @Ctx() ctx: Context) {
    const { subsidiaryController } = ctx.controllers;
    return subsidiaryController.getSubsidiaryByPerson(userId);
  }

  @Query(returns => [SubsidiaryType])
  commerceSubsidiaries(@Arg('commerceId') commerceId: string, @Ctx() ctx: Context) {
    const { subsidiaryController } = ctx.controllers;
    return subsidiaryController.getCommerceSubsidiaries(commerceId);
  }

  @Mutation(returns => SubsidiaryType)
  addSubsidiary(@Arg('subsidiary') sub: SubsidiaryInputType, @Ctx() ctx: Context) {
    const { subsidiaryController } = ctx.controllers;
    return subsidiaryController.create(sub);
  }

  @FieldResolver()
  personInCharge(@Root() sub: Subsidiary, @Ctx() ctx: Context): Promise<User> {
    const { userController } = ctx.controllers;
    return userController.findbyId(<string>sub.personInCharge);
  }

  @FieldResolver()
  commerce(@Root() sub: Subsidiary, @Ctx() ctx: Context): Promise<Commerce> {
    const { commerceController } = ctx.controllers;
    return commerceController.findbyId(<string>sub.commerce);
  }

}
