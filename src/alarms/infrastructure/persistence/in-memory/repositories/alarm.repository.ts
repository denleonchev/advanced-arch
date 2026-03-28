import { Injectable } from '@nestjs/common';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmMapper } from '../mappers/alarm.mapper';

@Injectable()
export class InMemoryAlarmRepository implements AlarmRepository {
  private readonly alarms = new Map<string, AlarmEntity>();

  findAll() {
    const values = Array.from(this.alarms.values());
    return Promise.resolve(values.map((value) => AlarmMapper.toDomain(value)));
  }

  save(alarm: Alarm): Promise<Alarm> {
    const persistenceModel = AlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);
    const savedEntity = this.alarms.get(persistenceModel.id)!;

    return Promise.resolve(AlarmMapper.toDomain(savedEntity));
  }
}
