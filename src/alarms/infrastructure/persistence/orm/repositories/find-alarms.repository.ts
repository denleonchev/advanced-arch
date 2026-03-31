import { Injectable } from '@nestjs/common';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { InjectModel } from '@nestjs/mongoose';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrmFindAlarmRepository implements FindAlarmRepository {
  constructor(
    @InjectModel(MaterializedAlarmView.name)
    private readonly alarmModel: Model<MaterializedAlarmView>,
  ) {}

  findAll() {
    return this.alarmModel.find();
  }
}
