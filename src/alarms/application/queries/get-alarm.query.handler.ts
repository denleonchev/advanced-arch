import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AlarmRepository } from '../ports/alarm.repository';
import { GetAlarmQuery } from './get-alarm.query';
import { Alarm } from 'src/alarms/domain/alarm';

@QueryHandler(GetAlarmQuery)
export class GetAlarmQueryHandler implements IQueryHandler<
  GetAlarmQuery,
  Alarm[]
> {
  private readonly logger = new Logger(GetAlarmQueryHandler.name);

  constructor(private readonly alarmRepository: AlarmRepository) {}

  execute(query: GetAlarmQuery) {
    this.logger.debug(`processing "GetAlarmQuery": ${JSON.stringify(query)}`);

    return this.alarmRepository.findAll();
  }
}
