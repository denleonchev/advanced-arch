import { Injectable } from '@nestjs/common';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmMapper } from '../mappers/alarm.mapper';
import { AlarmEntity } from '../entities/alarm.entity';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { UpsertMaterializedAlarmRepository } from 'src/alarms/application/ports/upsert-materialized-alarm.repository';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@Injectable()
export class InMemoryAlarmRepository
  implements
    CreateAlarmRepository,
    FindAlarmRepository,
    UpsertMaterializedAlarmRepository
{
  private readonly alarms = new Map<string, AlarmEntity>();
  private readonly materializedAlarmViews = new Map<string, AlarmReadModel>();

  findAll() {
    return Promise.resolve(Array.from(this.materializedAlarmViews.values()));
  }

  save(alarm: Alarm): Promise<Alarm> {
    const persistenceModel = AlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);
    const savedEntity = this.alarms.get(persistenceModel.id)!;

    return Promise.resolve(AlarmMapper.toDomain(savedEntity));
  }

  upsert(alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>) {
    if (this.materializedAlarmViews.has(alarm.id)) {
      this.materializedAlarmViews.set(alarm.id, {
        ...this.materializedAlarmViews.get(alarm.id)!,
        ...alarm,
      });
    } else {
      this.materializedAlarmViews.set(alarm.id, alarm as AlarmReadModel);
    }

    return Promise.resolve();
  }
}
