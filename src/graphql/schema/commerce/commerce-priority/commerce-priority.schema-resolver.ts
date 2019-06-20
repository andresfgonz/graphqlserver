import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql/dist';
import { Context } from '@graphql/types';
import { CommercePriorityType } from '@schema/commerce/commerce-priority/commerce-priority.type';

@Resolver(CommercePriorityType)
export class CommercePrioritySchemaResolver {
  @Query(returns => [CommercePriorityType])
  commercePriorities(@Ctx() ctx: Context) {
    const { commercePriorityController } = ctx.controllers;
    return commercePriorityController.findAll();
  }

  @Mutation(returns => CommercePriorityType)
  addCommercePriority(
    @Arg('name') name: string,
    @Arg('color') color: string,
    @Ctx() ctx: Context,
  ) {
    const { commercePriorityController } = ctx.controllers;
    return commercePriorityController.create({ name, color });
  }
}
