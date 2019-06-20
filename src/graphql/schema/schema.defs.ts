import { Field, ObjectType } from 'type-graphql/dist';

@ObjectType()
export class ActionResult {
  @Field() success: boolean;
  @Field() message?: string;
  @Field() error?: string;
}