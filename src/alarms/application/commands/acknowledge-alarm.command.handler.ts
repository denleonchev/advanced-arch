import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AcknowledgeAlarmCommand } from './acknowledge-alarm.command';
import { AggregateRehydrator } from 'src/shared/application/event-rehydrator';
import { Alarm } from 'src/alarms/domain/alarm';

@CommandHandler(AcknowledgeAlarmCommand)
export class AcknowledgeAlarmCommandHandler implements ICommandHandler<AcknowledgeAlarmCommand> {
  private readonly logger = new Logger(AcknowledgeAlarmCommand.name);

  constructor(private readonly aggregateRehydrator: AggregateRehydrator) {}

  async execute(command: AcknowledgeAlarmCommand) {
    this.logger.debug(
      `processing "AcknowledgeAlarmCommand": ${JSON.stringify(command)}`,
    );
    const alarm = await this.aggregateRehydrator.rehydrate(
      command.alarmId,
      Alarm,
    );
    alarm.acknowledge();
    alarm.commit();

    return Promise.resolve(alarm);
  }
}
