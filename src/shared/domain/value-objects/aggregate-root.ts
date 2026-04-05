import { AggregateRoot } from '@nestjs/cqrs';
import { Version } from './version';
import { SerializableEvent } from './interfaces/serializable-event';

const VERSION = Symbol('version');

export class VersionedAggregateRoot extends AggregateRoot {
  public id: string;

  private [VERSION] = new Version(0);

  get version(): Version {
    return this[VERSION];
  }

  loadFromHistory(history: SerializableEvent[]) {
    const domainEvents = history.map((event) => event.data);
    super.loadFromHistory(domainEvents);
    const lastEvent = history[history.length - 1];
    this.setVersion(new Version(lastEvent.position));
  }

  private setVersion(version: Version) {
    this[VERSION] = version;
  }
}
