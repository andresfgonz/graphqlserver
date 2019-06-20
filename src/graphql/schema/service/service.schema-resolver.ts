import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation, Publisher, PubSub,
  Query,
  Resolver, ResolverFilterData,
  Root,
  Subscription,
} from 'type-graphql/dist';
import { CreateServiceInputType, ServiceType } from '@schema/service/service.type';
import { Context } from '@graphql/types';
import { Service } from '@appTypes';
import { SubscriptionTopics } from '@graphql/config';
import { ActionResult } from '@schema/schema.defs';


@Resolver(ServiceType)
export class ServiceSchemaResolver {
  @Query(returns => [ServiceType])
  services(@Ctx() ctx: Context) {
    const { serviceController } = ctx.controllers;
    return serviceController.findAll();
  }

  @Query(returns => [ServiceType])
  technicianServices(@Arg('technicianId') technicianId: string, @Ctx() ctx: Context) {
    const { serviceController } = ctx.controllers;
    return serviceController.getTechnicianServices(technicianId);
  }

  @Query(returns => ServiceType, { nullable: true })
  technicianActiveService(@Arg('technicianId') technicianId: string, @Ctx() ctx: Context) {
    const { serviceController } = ctx.controllers;
    return serviceController.getTechnicianActiveService(technicianId);
  }

  @Mutation(returns => ServiceType)
  async createService(
    @Arg('serviceData') data: CreateServiceInputType,
    @Ctx() ctx: Context,
    @PubSub(SubscriptionTopics.ServiceCreated) publishServiceCreated: Publisher<Service>,
  ) {
    const { serviceController } = ctx.controllers;
    const service = await serviceController.create(data);
    await publishServiceCreated(service);

    return service;
  }

  @Mutation(returns => ServiceType)
  async addServiceTechnician(
    @Arg('serviceId') serviceId: string,
    @Arg('technicianId') technicianId: string,
    @Arg('scheduledTime') scheduledTime: string,
    @Ctx() ctx: Context,
    @PubSub(SubscriptionTopics.ServiceAsigned) publishServiceAsigned: Publisher<Service>,
  ) {
    const { serviceController } = ctx.controllers;
    const ser = await serviceController.asignTechnicianToService(serviceId, technicianId, scheduledTime);

    await publishServiceAsigned(ser);

    return ser;
  }

  @Mutation(returns => ActionResult)
  async deleteService(
    @Arg('serviceId') serviceId: string,
    @Ctx() ctx: Context,
    @PubSub(SubscriptionTopics.ServicedDeleted) publishServiceDeleted: Publisher<Service>,
  ): Promise<ActionResult> {
    const { serviceController } = ctx.controllers;
    const deletedService = await serviceController.delete(serviceId);

    await publishServiceDeleted(deletedService);

    return {
      success: true,
      message: 'service deleted',
    }
  }

  @Mutation(returns => ActionResult)
  async initService(@Arg('serviceId') serviceId: string, @Ctx() ctx: Context) {
    const { serviceController } = ctx.controllers;
    await serviceController.initService(serviceId);

    return {
      success: true,
      message: 'service initialized',
    }
  }

  @Mutation(returns => ActionResult)
  async finishService(
    @Arg('serviceId') serviceId: string,
    @Arg('status') status: string,
    @Ctx() ctx: Context,
  ) {
    const { serviceController } = ctx.controllers;
    await serviceController.finishService(serviceId, status);

    return {
      success: true,
      message: 'service finished',
    }
  }

  @FieldResolver()
  issues(@Root() service: Service, @Ctx() ctx: Context) {
    const { issueController } = ctx.controllers;
    return issueController.findInArray(<string[]>service.issues)
  }

  @FieldResolver()
  subsidiary(@Root() service: Service, @Ctx() ctx: Context) {
    const { subsidiaryController } = ctx.controllers;
    return subsidiaryController.findbyId(<string>service.subsidiary);
  }

  @FieldResolver()
  technician(@Root() service: Service, @Ctx() ctx: Context) {
    const { userController } = ctx.controllers;
    return userController.findbyId(<string>service.technician);
  }

  @Subscription(returns => ServiceType, {
    topics: SubscriptionTopics.ServiceCreated,
  })
  serviceCreated(@Root() service: Service): Service {
    return service;
  }

  @Subscription(returns => ServiceType, {
    topics: SubscriptionTopics.ServicedDeleted,
  })
  serviceDeleted(@Root() service: Service): Service {
    return service;
  }

  @Subscription(returns => ServiceType, {
    topics: SubscriptionTopics.ServiceAsigned,
  })
  serviceAsigned(@Root() service: Service): Service {
    return service;
  }
}
