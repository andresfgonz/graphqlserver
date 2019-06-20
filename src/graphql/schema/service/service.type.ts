import { Issue, Service, Subsidiary, User } from '@appTypes';
import { Field, ID, InputType, ObjectType } from 'type-graphql/dist';
import { IssueType } from '@schema/issue/issue.type';
import { SubsidiaryType } from '@schema/commerce/subsidiary/subsidiary.type';
import { type } from 'os';
import { UserType } from '@schema/user';

@ObjectType()
export class ServiceType implements Service {
  @Field(type => ID) id?: string;
  @Field(type => [IssueType]) issues: Issue[];
  @Field(type => SubsidiaryType) subsidiary: Subsidiary;
  @Field(type => UserType, { nullable: true }) technician: User;
  @Field() creationComments: string;
  @Field() status: string;
  @Field() active: boolean;
  @Field({ nullable: true}) scheduledTime: Date;
}

@InputType()
export class CreateServiceInputType implements Partial<Service> {
  @Field(type => [String]) issues: string[];
  @Field() subsidiary: string;
  @Field() creationComments: string;
}
