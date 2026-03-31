import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmEntity } from './entities/alarm.entity';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { OrmCreateAlarmRepository } from './repositories/create-alarm.repository';
import { AlarmItemEntity } from './entities/alarm-item.entity';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { OrmFindAlarmRepository } from './repositories/find-alarms.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterializedAlarmView,
  MaterializedAlarmViewSchema,
} from './schemas/materialized-alarm-view.schema';
import { UpsertMaterializedAlarmRepository } from 'src/alarms/application/ports/upsert-materialized-alarm.repository';
import { OrmUpsertMaterializedAlarmRepository } from './repositories/upsert-alarms.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmEntity, AlarmItemEntity]),
    MongooseModule.forFeature([
      { name: MaterializedAlarmView.name, schema: MaterializedAlarmViewSchema },
    ]),
  ],
  providers: [
    { provide: CreateAlarmRepository, useClass: OrmCreateAlarmRepository },
    { provide: FindAlarmRepository, useClass: OrmFindAlarmRepository },
    {
      provide: UpsertMaterializedAlarmRepository,
      useClass: OrmUpsertMaterializedAlarmRepository,
    },
  ],
  exports: [
    CreateAlarmRepository,
    FindAlarmRepository,
    UpsertMaterializedAlarmRepository,
  ],
})
export class OrmAlarmPersistenceModule {}
