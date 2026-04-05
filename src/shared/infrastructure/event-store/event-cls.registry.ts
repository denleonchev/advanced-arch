import { Type } from '@nestjs/common';

export class EventClsRegistry {
  private static readonly eventClsMap = new Map<string, Type>();

  static add(eventCls: Type<any>) {
    this.eventClsMap.set(eventCls.name, eventCls);
  }

  static get(eventClsName: string) {
    const eventCls = this.eventClsMap.get(eventClsName);
    if (!eventCls) {
      throw new Error(`Event class "${eventClsName}" not registered`);
    }

    return eventCls;
  }
}
