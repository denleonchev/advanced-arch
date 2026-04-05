import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constants';
import { EventDocument } from './schemas/event.schema';
import { SerializableEvent } from 'src/shared/domain/value-objects/interfaces/serializable-event';

@Injectable()
export class MongoEventStore {
  private readonly logger = new Logger(MongoEventStore.name);

  constructor(
    @InjectModel(EventDocument.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<EventDocument>,
  ) {}

  async persist(eventOrEvents: SerializableEvent | SerializableEvent[]) {
    const events = Array.isArray(eventOrEvents)
      ? eventOrEvents
      : [eventOrEvents];
    const session = await this.eventStore.startSession();
    try {
      session.startTransaction();
      await this.eventStore.insertMany(events, { session, ordered: true });
      await session.commitTransaction();
      this.logger.debug('Events persisted successfully');
    } catch (error) {
      await session.abortTransaction();
      const UNIQUE_CONSTRAINT_VIOLATION = 11000;
      if (error?.code === UNIQUE_CONSTRAINT_VIOLATION) {
        this.logger.error('Event already exists');
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
