import { AbstractController } from '@controllers';
import { ServiceModel } from '@db/models';
import * as moment from 'moment';

export class ServiceController extends AbstractController<ServiceModel> {
  constructor() {
    super(ServiceModel);
  }

  asignTechnicianToService(serviceId: string, technician: string, time: string): Promise<ServiceModel> {
    const scheduledTime = moment(time, 'DD-MM-YYYY HH:mm').toDate();
    return this.model.findByIdAndUpdate(serviceId, {
      technician,
      scheduledTime,
      status: 'Asignado',
    }, { new: true }).exec();
  }

  getTechnicianServices(technician: string): Promise<ServiceModel[]> {
    return this.model.find({
      technician,
      active: false,
      scheduledTime: {
        $gt: moment().startOf('day').toDate(),
        $lt: moment().endOf('day').toDate(),
      },
      status: { $ne: 'Cerrado'}
    }).sort({ scheduledTime: 1 }).exec();
  }

  getTechnicianActiveService(technician: string): Promise<ServiceModel> {
    return this.model.findOne({ technician, active: true }).exec();
  }

  initService(serviceId: string): Promise<ServiceModel> {
    return this.model.findByIdAndUpdate(serviceId, {
      status: 'Iniciado',
      active: true,
    }, { new: true }).exec();
  }

  finishService(serviceId: string, status: string): Promise<ServiceModel> {
    return this.model.findByIdAndUpdate(serviceId, { status, active: false }, { new: true }).exec();
  }
}
