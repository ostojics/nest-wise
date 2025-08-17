import {InviteUserDTO, inviteUserSchema, UserContract} from '@maya-vault/contracts';
import {Body, Controller, Get, HttpCode, Post, UseGuards, UsePipes} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {Logger} from 'pino-nestjs';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard, JwtPayload} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {UserResponseSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';
import {UsersService} from './users.service';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Get users in my household',
    description: "Retrieves all users that belong to the authenticated user's household",
  })
  @ApiOkResponse({
    type: [UserResponseSwaggerDTO],
    description: 'Users retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('')
  async getUsers(@CurrentUser() user: JwtPayload): Promise<UserContract[]> {
    const me = await this.usersService.findUserById(user.sub);
    return (await this.usersService.findUsersByHouseholdId(me.householdId)) as UserContract[];
  }

  @ApiOperation({
    summary: 'Invite a user to my household',
    description: "Invites a user to the authenticated user's household",
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  @HttpCode(204)
  @Post('invite')
  async inviteUser(@CurrentUser() user: JwtPayload, @Body() body: InviteUserDTO) {
    try {
      const me = await this.usersService.findUserById(user.sub);
      await this.usersService.inviteUser(me.householdId, body.email);
      this.logger.log(`User invitation sent to ${body.email} by ${me.email}`);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
