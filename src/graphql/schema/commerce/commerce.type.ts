import { Commerce, CommercePriority, GeoLocation, Image } from '@appTypes';
import { Field, InputType, ObjectType } from 'type-graphql/dist';
import { CommercePriorityType } from '@schema/commerce/commerce-priority/commerce-priority.type';

@ObjectType()
export class CommerceType implements Commerce {
  @Field() id: string;
  @Field() name: string;
  @Field() tinNumber: string;
  @Field({ nullable: true }) logoImage: string;
  @Field(type => CommercePriorityType) priority: CommercePriority;
  @Field(type => GeoLocationType) geoLocation: GeoLocation;
}

@InputType()
class LogoImageType implements Image {
  @Field() extension: string;
  @Field() name: string;
}

@ObjectType()
class GeoLocationType implements GeoLocation {
  @Field() lat: number;
  @Field() lon: number;
}

@InputType()
export class CommerceInputType implements Partial<Commerce> {
  @Field() name: string;
  @Field() tinNumber: string;
  @Field(type => LogoImageType) logoImage: Image;
}
