import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BudgetAllocation} from './budget-allocation.entity';
import {BudgetAllocationCategory} from './budget-allocation-category.entity';
import {BudgetAllocationRepository} from './budget-allocation.repository';
import {BudgetAllocationService} from './budget-allocation.service';
import {HouseholdBudgetAllocationController} from './household-budget-allocation.controller';
import {PoliciesModule} from 'src/policies/policies.module';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetAllocation, BudgetAllocationCategory]), PoliciesModule],
  controllers: [HouseholdBudgetAllocationController],
  providers: [BudgetAllocationService, BudgetAllocationRepository],
  exports: [BudgetAllocationService],
})
export class BudgetAllocationModule {}
