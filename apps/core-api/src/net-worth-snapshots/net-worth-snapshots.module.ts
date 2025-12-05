import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from '@nestjs/bullmq';
import {NetWorthSnapshot} from './net-worth-snapshot.entity';
import {NetWorthSnapshotsRepository} from './net-worth-snapshots.repository';
import {NetWorthSnapshotsService} from './net-worth-snapshots.service';
import {NetWorthSnapshotsOrchestrator} from './net-worth-snapshots.orchestrator';
import {Queues} from '../common/enums/queues.enum';
import {HouseholdsModule} from '../households/households.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NetWorthSnapshot]),
    BullModule.registerQueue({name: Queues.NET_WORTH_SNAPSHOTS}),
    HouseholdsModule,
  ],
  providers: [NetWorthSnapshotsRepository, NetWorthSnapshotsService, NetWorthSnapshotsOrchestrator],
  exports: [NetWorthSnapshotsService, NetWorthSnapshotsRepository],
})
export class NetWorthSnapshotsModule {}
