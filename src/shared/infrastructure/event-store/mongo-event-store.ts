import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constants';
import { EventDocument } from './schemas/event.schema';
import { SerializableEvent } from 'src/shared/domain/value-objects/interfaces/serializable-event';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventStore } from 'src/shared/application/ports/event-store';

@Injectable()
export class MongoEventStore implements EventStore {
  private readonly logger = new Logger(MongoEventStore.name);

  constructor(
    @InjectModel(EventDocument.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<EventDocument>,
    private readonly eventDeserializer: EventDeserializer,
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

  async getEventsByStreamId(streamId: string) {
    const events = await this.eventStore
      .find({ streamId })
      .sort({ position: 1 });
    if (events.length === 0) {
      throw new Error(`Aggregate with id ${streamId} does not exist`);
    }

    return events.map((event) =>
      this.eventDeserializer.deserialize(event.toJSON()),
    );
  }
}
