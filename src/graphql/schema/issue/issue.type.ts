import { Issue } from '@appTypes';
import { Field, ObjectType } from 'type-graphql/dist';

@ObjectType()
export class IssueType implements Issue {
  @Field() id: string;
  @Field() name: string;
}
