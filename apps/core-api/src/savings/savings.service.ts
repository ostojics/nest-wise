import {InjectQueue} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {Job, Queue} from 'bullmq';
import {SavingsJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {CalculateSavingsPayload} from 'src/common/interfaces/savings.interfaces';
import {HouseholdsService} from 'src/households/households.service';
import {TransactionsService} from 'src/transactions/transactions.service';

@Injectable()
export class SavingsService {
  constructor(
    @InjectQueue(Queues.SAVINGS) private savingsQueue: Queue,
    private readonly householdsService: HouseholdsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Cron('0 0 1 * *', {
    timeZone: 'UTC',
  })
  async calculateSavingsSchedule() {
    const households = await this.householdsService.findAllHouseholds();
    const jobsPromises: Promise<Job>[] = [];

    for (const household of households) {
      jobsPromises.push(
        this.savingsQueue.add(SavingsJobs.CALCULATE_SAVINGS, {
          householdId: household.id,
        }),
      );
    }

    await Promise.all(jobsPromises);
  }

  async calculateSavings(payload: CalculateSavingsPayload) {
    // TODO: Implement savings calculation
  }
}
