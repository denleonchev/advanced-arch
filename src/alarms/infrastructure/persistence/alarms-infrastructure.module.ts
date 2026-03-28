import { Module } from '@nestjs/common';
import { OrmAlarmPersistenceModule } from './orm/orm-persistence.module';
import { InMemoryAlarmPersistenceModule } from './in-memory/in-memory-persistence.module';

@Module({})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm'
        ? OrmAlarmPersistenceModule
        : InMemoryAlarmPersistenceModule;
    return {
      module: AlarmsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
