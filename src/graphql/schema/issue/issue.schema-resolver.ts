import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql/dist';
import { IssueType } from '@schema/issue/issue.type';
import { Context } from '@graphql/types';

@Resolver(IssueType)
export class IssueSchemaResolver {
  @Query(returns => [IssueType])
  issues(@Ctx() ctx: Context) {
    const { issueController } = ctx.controllers;
    return issueController.findAll();
  }

  @Mutation(returns => IssueType)
  createIssue(@Arg('name') name: string, @Ctx() ctx: Context) {
    const { issueController } = ctx.controllers;
    return issueController.create({ name });
  }

}
