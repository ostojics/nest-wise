import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {Job, Queue} from 'bullmq';
import {InjectQueue} from '@nestjs/bullmq';
import {Logger} from 'pino-nestjs';
import {Queues} from '../common/enums/queues.enum';
import {NetWorthSnapshotJobs} from '../common/enums/jobs.enum';
import {NetWorthSnapshotsRepository} from './net-worth-snapshots.repository';
import {HouseholdsRepository} from '../households/households.repository';
import {subMonths, getYear, getMonth, endOfMonth} from 'date-fns';

@Processor(Queues.NET_WORTH_SNAPSHOTS, {concurrency: 1})
@Injectable()
export class NetWorthSnapshotsOrchestrator extends WorkerHost implements OnModuleInit {
  constructor(
    @InjectQueue(Queues.NET_WORTH_SNAPSHOTS) private readonly queue: Queue,
    private readonly snapshotsRepository: NetWorthSnapshotsRepository,
    private readonly householdsRepository: HouseholdsRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  async onModuleInit() {
    try {
      await this.queue.add(
        NetWorthSnapshotJobs.ORCHESTRATOR,
        {},
        {
          repeat: {
            pattern: '0 0 1 * *', // Midnight on 1st of each month
            key: 'net-worth-snapshots-orchestrator',
          },
        },
      );

      this.logger.debug('Net worth snapshots orchestrator job registered');
    } catch (error) {
      this.logger.error('Failed to register net worth snapshots orchestrator job', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  async process(job: Job): Promise<void> {
    if (job.name === String(NetWorthSnapshotJobs.ORCHESTRATOR)) {
      await this.captureMonthlySnapshots();
    }
  }

  private async captureMonthlySnapshots(): Promise<void> {
    // Use date-fns to get previous month
    const now = new Date();
    const targetDate = subMonths(now, 1);
    const year = getYear(targetDate);
    const month = getMonth(targetDate) + 1; // date-fns months are 0-indexed

    this.logger.log(`Capturing net worth snapshots for ${year}-${month}`);

    const households = await this.householdsRepository.findAll();
    const householdIds = households.map((h) => h.id);

    for (const householdId of householdIds) {
      try {
        const totalBalance = await this.snapshotsRepository.getCurrentTotalBalance(householdId);

        await this.snapshotsRepository.upsert({
          householdId,
          year,
          month,
          totalBalance,
          snapshotDate: endOfMonth(targetDate),
        });

        this.logger.debug(`Snapshot captured for household ${householdId}: ${totalBalance}`);
      } catch (error) {
        this.logger.error(`Failed to capture snapshot for household ${householdId}`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    this.logger.log(`Completed snapshots for ${householdIds.length} households`);
  }
}
