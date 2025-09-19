import {InviteUserDTO, inviteUserSchema, UserContract} from '@nest-wise/contracts';
import {Body, Controller, Get, HttpCode, Post, UseGuards, UsePipes, Header} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {Logger} from 'pino-nestjs';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {InviteUserSwaggerDTO, UserResponseSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';
import {UsersService} from './users.service';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';

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
    description:
      "Retrieves all users that belong to the authenticated user's household. DEPRECATED: Use GET /v1/households/{householdId}/users instead",
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
  @Header('Deprecation', 'true')
  @Header('Sunset', '2025-06-01')
  @Header('Link', '</v1/households/{householdId}/users>; rel="successor-version"')
  @Get('')
  async getUsers(@CurrentUser() user: JwtPayload): Promise<UserContract[]> {
    const me = await this.usersService.findUserById(user.sub);
    return (await this.usersService.findUsersByHouseholdId(me.householdId)) as UserContract[];
  }

  @ApiOperation({
    summary: 'Invite a user to my household',
    description:
      "Invites a user to the authenticated user's household. DEPRECATED: Use POST /v1/households/{householdId}/invites instead",
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  @ApiBody({
    type: InviteUserSwaggerDTO,
    description: 'Email address of the user to invite',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  @Header('Deprecation', 'true')
  @Header('Sunset', '2025-06-01')
  @Header('Link', '</v1/households/{householdId}/invites>; rel="successor-version"')
  @HttpCode(204)
  @Post('invites')
  async inviteUser(@CurrentUser() user: JwtPayload, @Body() body: InviteUserDTO) {
    try {
      const me = await this.usersService.findUserById(user.sub);
      await this.usersService.inviteUser(me.householdId, body.email);
      this.logger.log(`User invitation sent to ${body.email} by ${me.email}`);
    } catch (error) {
      this.logger.error('Failed to invite user', error);
      throw error;
    }
  }
}
