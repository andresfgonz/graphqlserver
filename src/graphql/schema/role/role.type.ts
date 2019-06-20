import { Role } from '../../../types';
import { Field, ID, ObjectType } from 'type-graphql/dist';

@ObjectType()
export class RoleType implements Role {
  @Field(type => ID) id: any;
  @Field() name: string;
}