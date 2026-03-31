import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { GetAlarmQuery } from './get-alarm.query';
import { FindAlarmRepository } from '../ports/find-alarm.repository';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@QueryHandler(GetAlarmQuery)
export class GetAlarmQueryHandler implements IQueryHandler<
  GetAlarmQuery,
  AlarmReadModel[]
> {
  private readonly logger = new Logger(GetAlarmQueryHandler.name);

  constructor(private readonly findAlarmRepository: FindAlarmRepository) {}

  execute(query: GetAlarmQuery) {
    this.logger.debug(`processing "GetAlarmQuery": ${JSON.stringify(query)}`);

    return this.findAlarmRepository.findAll();
  }
}
