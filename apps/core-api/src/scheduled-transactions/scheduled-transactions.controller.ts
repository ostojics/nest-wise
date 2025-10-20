import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  UsePipes,
} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ScheduledTransactionsService} from './scheduled-transactions.service';
import {ScheduledTransactionRule} from './scheduled-transaction-rule.entity';
import {PoliciesService} from '../policies/policies.service';
import {AuthGuard} from '../common/guards/auth.guard';
import {CurrentUser} from '../common/decorators/current-user.decorator';
import {JwtPayload} from '../common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from '../lib/pipes/zod.vallidation.pipe';
import {
  CreateScheduledTransactionRuleHouseholdDTO,
  UpdateScheduledTransactionRuleDTO,
  GetScheduledTransactionsQueryHouseholdDTO,
  GetScheduledTransactionsResponseContract,
  ScheduledTransactionRuleContract,
  createScheduledTransactionRuleHouseholdSchema,
  updateScheduledTransactionRuleSchema,
  getScheduledTransactionsQueryHouseholdSchema,
} from '@nest-wise/contracts';

@ApiTags('Scheduled Transactions')
@Controller({path: 'households/:householdId/scheduled-transactions', version: '1'})
@UseGuards(AuthGuard)
export class ScheduledTransactionsController {
  constructor(
    private readonly scheduledTransactionsService: ScheduledTransactionsService,
    private readonly policiesService: PoliciesService,
  ) {}

  @Post()
  @ApiOperation({summary: 'Create a new scheduled transaction rule'})
  @ApiResponse({status: 201, description: 'Rule created successfully'})
  @UsePipes(new ZodValidationPipe(createScheduledTransactionRuleHouseholdSchema))
  async createRule(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Body() body: CreateScheduledTransactionRuleHouseholdDTO,
  ): Promise<ScheduledTransactionRuleContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    const rule = await this.scheduledTransactionsService.createRule(householdId, user.sub, body);
    return this.toContract(rule);
  }

  @Get()
  @ApiOperation({summary: 'Get all scheduled transaction rules for the household'})
  @ApiResponse({status: 200, description: 'Rules retrieved successfully'})
  @UsePipes(new ZodValidationPipe(getScheduledTransactionsQueryHouseholdSchema))
  async getRules(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Query() query: GetScheduledTransactionsQueryHouseholdDTO,
  ): Promise<GetScheduledTransactionsResponseContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    return await this.scheduledTransactionsService.findRulesForHousehold(householdId, query);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a specific scheduled transaction rule'})
  @ApiResponse({status: 200, description: 'Rule retrieved successfully'})
  async getRule(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ): Promise<ScheduledTransactionRuleContract> {
    const rule = await this.scheduledTransactionsService.findRuleById(id);

    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, rule.householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom pravilu');
    }

    return this.toContract(rule);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update a scheduled transaction rule'})
  @ApiResponse({status: 200, description: 'Rule updated successfully'})
  @UsePipes(new ZodValidationPipe(updateScheduledTransactionRuleSchema))
  async updateRule(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Param('id') id: string,
    @Body() body: UpdateScheduledTransactionRuleDTO,
  ): Promise<ScheduledTransactionRuleContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    const rule = await this.scheduledTransactionsService.updateRule(id, householdId, body);
    return this.toContract(rule);
  }

  @Post(':id/pause')
  @ApiOperation({summary: 'Pause a scheduled transaction rule'})
  @ApiResponse({status: 200, description: 'Rule paused successfully'})
  async pauseRule(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ): Promise<ScheduledTransactionRuleContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    const rule = await this.scheduledTransactionsService.pauseRule(id, householdId);
    return this.toContract(rule);
  }

  @Post(':id/resume')
  @ApiOperation({summary: 'Resume a paused scheduled transaction rule'})
  @ApiResponse({status: 200, description: 'Rule resumed successfully'})
  async resumeRule(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ): Promise<ScheduledTransactionRuleContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    const rule = await this.scheduledTransactionsService.resumeRule(id, householdId);
    return this.toContract(rule);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a scheduled transaction rule'})
  @ApiResponse({status: 200, description: 'Rule deleted successfully'})
  async deleteRule(
    @CurrentUser() user: JwtPayload,
    @Param('householdId') householdId: string,
    @Param('id') id: string,
  ): Promise<{message: string}> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    await this.scheduledTransactionsService.deleteRule(id, householdId);
    return {message: 'Pravilo je uspešno obrisano'};
  }

  private toContract(rule: ScheduledTransactionRule): ScheduledTransactionRuleContract {
    return {
      id: rule.id,
      householdId: rule.householdId,
      userId: rule.createdByUserId,
      accountId: rule.accountId,
      categoryId: rule.categoryId,
      type: rule.type,
      amount: Number(rule.amount),
      description: rule.description,
      frequencyType: rule.frequencyType,
      dayOfWeek: rule.dayOfWeek,
      dayOfMonth: rule.dayOfMonth,
      startDate: rule.startDate instanceof Date ? rule.startDate.toISOString().split('T')[0] : rule.startDate,
      status: rule.status,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }
}
