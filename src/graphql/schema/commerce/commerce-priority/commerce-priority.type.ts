import { CommercePriority } from '@appTypes';
import { Field, ObjectType } from 'type-graphql/dist';

@ObjectType()
export class CommercePriorityType implements CommercePriority {
  @Field() id: string;
  @Field() name: string;
  @Field() color: string;
}
