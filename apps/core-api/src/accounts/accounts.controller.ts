import {EditAccountDTO, editAccountSchema} from '@nest-wise/contracts';
import {Body, Controller, ForbiddenException, Get, Param, Put, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {PoliciesService} from 'src/policies/policies.service';
import {AccountResponseSwaggerDTO, UpdateAccountSwaggerDTO} from 'src/tools/swagger/accounts.swagger.dto';
import {AccountsService} from './accounts.service';

@ApiTags('Accounts')
@Controller({
  version: '1',
  path: 'accounts',
})
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly policiesService: PoliciesService,
  ) {}

  @ApiOperation({
    summary: 'Get account by ID',
    description: 'Retrieves a specific account by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the account',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    type: AccountResponseSwaggerDTO,
    description: 'Account found successfully',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return await this.accountsService.findAccountById(id);
  }

  @ApiOperation({
    summary: 'Update an account',
    description: 'Updates account name, type, or current balance. User must belong to the account household.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the account',
  })
  @ApiBody({
    type: UpdateAccountSwaggerDTO,
    description: 'Account update data',
  })
  @ApiOkResponse({
    type: AccountResponseSwaggerDTO,
    description: 'Account updated successfully',
  })
  @ApiBadRequestResponse({description: 'Invalid input data'})
  @ApiNotFoundResponse({description: 'Account not found'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(editAccountSchema))
  @Put(':id')
  async updateAccount(@Param('id') id: string, @Body() dto: EditAccountDTO, @CurrentUser() user: JwtPayload) {
    const canUpdate = await this.policiesService.canUserUpdateAccount(user.sub, id);
    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this account');
    }

    return await this.accountsService.updateAccount(id, dto);
  }
}
