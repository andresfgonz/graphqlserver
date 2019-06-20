import { Commerce, Subsidiary, User } from '@appTypes';
import { Field, InputType, ObjectType } from 'type-graphql/dist';
import { CommerceType } from '@schema/commerce/commerce.type';
import { UserType } from '@schema/user';

@ObjectType()
export class SubsidiaryType implements Subsidiary {
  @Field() id: string;
  @Field() name: string;
  @Field(type => CommerceType) commerce: Commerce;
  @Field(type => UserType, { nullable: true }) personInCharge: User;
  @Field() address: string;
}

@InputType()
export class SubsidiaryInputType implements Partial<Subsidiary> {
  @Field() name: string;
  @Field() address: string;
  @Field() commerce: string;
  @Field({ nullable: true }) personInCharge: string;
}
