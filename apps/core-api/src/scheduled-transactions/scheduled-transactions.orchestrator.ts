import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {Job, Queue} from 'bullmq';
import {InjectQueue} from '@nestjs/bullmq';
import {Logger} from 'pino-nestjs';
import {Queues} from '../common/enums/queues.enum';
import {ScheduledTransactionJobs} from '../common/enums/jobs.enum';
import {ScheduledTransactionsRepository} from './scheduled-transactions.repository';
import {ScheduledTransactionRule, ScheduledTransactionFrequencyType} from './scheduled-transaction-rule.entity';
import {getTodayUTC, getDayOfWeekUTC, getDayOfMonthUTC, formatUTCDate, clampDayOfMonth} from './date.util';

interface CreateTransactionJobData {
  ruleId: string;
  executionDate: string;
}

@Processor(Queues.SCHEDULED_TRANSACTIONS, {
  concurrency: 1, // Run orchestrator sequentially
})
@Injectable()
export class ScheduledTransactionsOrchestrator extends WorkerHost {
  constructor(
    @InjectQueue(Queues.SCHEDULED_TRANSACTIONS) private readonly queue: Queue,
    private readonly repository: ScheduledTransactionsRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === String(ScheduledTransactionJobs.ORCHESTRATOR)) {
      await this.processOrchestrator(job);
    }
  }

  private async processOrchestrator(job: Job): Promise<void> {
    this.logger.debug('Running scheduled transactions orchestrator (UTC)', {
      jobId: job.id,
    });

    try {
      const todayUTC = getTodayUTC();
      const todayString = formatUTCDate(todayUTC);

      this.logger.debug('Orchestrator evaluating rules for UTC date', {
        todayString,
      });

      // Find all due rules
      const dueRules = await this.repository.findDueRules(todayUTC);

      this.logger.debug(`Found ${dueRules.length} potentially due rules`, {
        count: dueRules.length,
        todayString,
      });

      const jobsToEnqueue: {ruleId: string; jobId: string; data: CreateTransactionJobData}[] = [];

      for (const rule of dueRules) {
        const isDue = this.isRuleDueToday(rule, todayUTC);

        if (isDue) {
          const jobId = `run-${rule.id}-${todayString}`;
          jobsToEnqueue.push({
            ruleId: rule.id,
            jobId,
            data: {
              ruleId: rule.id,
              executionDate: todayString,
            },
          });
        }
      }

      this.logger.debug(`Enqueueing ${jobsToEnqueue.length} transaction jobs`, {
        count: jobsToEnqueue.length,
        todayString,
      });

      // Enqueue all jobs
      if (jobsToEnqueue.length > 0) {
        const jobs = jobsToEnqueue.map(({jobId, data}) => ({
          name: ScheduledTransactionJobs.CREATE_TRANSACTION,
          data,
          opts: {
            jobId,
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        }));

        await this.queue.addBulk(jobs);

        // Update last_run_local_date for all rules that were enqueued
        for (const {ruleId} of jobsToEnqueue) {
          await this.repository.updateLastRun(ruleId, todayUTC);
        }

        this.logger.debug('Successfully enqueued transaction jobs and updated last run dates', {
          count: jobsToEnqueue.length,
          todayString,
        });
      }
    } catch (error) {
      this.logger.error('Orchestrator failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  private isRuleDueToday(rule: ScheduledTransactionRule, todayUTC: Date): boolean {
    const todayDayOfWeek = getDayOfWeekUTC(todayUTC);
    const todayDayOfMonth = getDayOfMonthUTC(todayUTC);

    if (String(rule.frequencyType) === String(ScheduledTransactionFrequencyType.WEEKLY)) {
      const isDue = rule.dayOfWeek === todayDayOfWeek;
      this.logger.debug('Checking weekly rule', {
        ruleId: rule.id,
        ruleDayOfWeek: rule.dayOfWeek,
        todayDayOfWeek,
        isDue,
      });
      return isDue;
    }

    if (String(rule.frequencyType) === String(ScheduledTransactionFrequencyType.MONTHLY)) {
      // Get year and month from UTC date
      const year = todayUTC.getUTCFullYear();
      const month = todayUTC.getUTCMonth() + 1;

      // Clamp the rule's day of month to the actual days in this month
      const clampedDayOfMonth = clampDayOfMonth(year, month, rule.dayOfMonth ?? 1);
      const isDue = clampedDayOfMonth === todayDayOfMonth;

      this.logger.debug('Checking monthly rule', {
        ruleId: rule.id,
        ruleDayOfMonth: rule.dayOfMonth,
        clampedDayOfMonth,
        todayDayOfMonth,
        isDue,
      });

      return isDue;
    }

    return false;
  }
}
