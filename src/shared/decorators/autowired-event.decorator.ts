import { Type } from '@nestjs/common';
import { EventClsRegistry } from '../infrastructure/event-store/event-cls.registry';
export const AutowiredEvent = (target: Type) => {
  EventClsRegistry.add(target);
};
