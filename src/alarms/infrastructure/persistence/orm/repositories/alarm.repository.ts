import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { Repository } from 'typeorm';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmMapper } from '../mappers/alarm.mapper';

@Injectable()
export class OrmAlarmRepository implements AlarmRepository {
  constructor(
    @InjectRepository(AlarmEntity)
    private readonly alarmRepository: Repository<AlarmEntity>,
  ) {}

  async findAll() {
    const entities = await this.alarmRepository.find();
    return entities.map((entity) => AlarmMapper.toDomain(entity));
  }

  async save(alarm: Alarm): Promise<Alarm> {
    const entity = AlarmMapper.toPersistence(alarm);
    const savedEntity = await this.alarmRepository.save(entity);

    return AlarmMapper.toDomain(savedEntity);
  }
}
