import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AggregateRehydrator } from 'src/shared/application/event-rehydrator';
import { NotifyFacilitySupervisorCommand } from './notify-facility-supervisor.command';

@CommandHandler(NotifyFacilitySupervisorCommand)
export class NotifyFacilitySupervisorCommandHandler implements ICommandHandler<NotifyFacilitySupervisorCommand> {
  private readonly logger = new Logger(NotifyFacilitySupervisorCommand.name);

  constructor(private readonly aggregateRehydrator: AggregateRehydrator) {}

  execute(command: NotifyFacilitySupervisorCommand) {
    this.logger.debug(
      `processing "NotifyFacilitySupervisorCommand": ${JSON.stringify(command)}`,
    );
    return Promise.resolve();
  }
}
