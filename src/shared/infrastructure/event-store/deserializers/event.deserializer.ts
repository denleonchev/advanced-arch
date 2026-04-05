import { Injectable, Type } from '@nestjs/common';
import { EventDocument } from '../schemas/event.schema';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.event';
import { EventClsRegistry } from '../event-cls.registry';

@Injectable()
export class EventDeserializer {
  deserialize(event: EventDocument) {
    const eventCls = this.getEventClassByType(event.type)!;

    return {
      ...event,
      data: this.instantiateSerializedEvent(eventCls, event.data),
    };
  }

  getEventClassByType(type: string) {
    return EventClsRegistry.get(type);
  }

  instantiateSerializedEvent<T extends Type>(
    eventCls: T,
    data: Record<string, any>,
  ) {
    return Object.assign<T, typeof data>(
      Object.create(eventCls.prototype),
      data,
    );
  }
}
