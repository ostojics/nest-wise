import {
  AcceptInviteDTO,
  acceptInviteSchema,
  InviteUserDTO,
  inviteUserSchema,
  UserContract,
} from '@maya-vault/contracts';
import {Body, Controller, Get, HttpCode, Post, Res, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
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
import {UserResponseSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';
import {UsersService} from './users.service';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {Response} from 'express';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {ConfigService} from '@nestjs/config';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
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
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  @HttpCode(204)
  @Post('invites')
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

  @ApiOperation({
    summary: 'Accept an invite to my household',
    description: "Accepts an invite to the authenticated user's household",
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  @ApiCreatedResponse({
    description: 'Invite accepted successfully',
  })
  @Post('invites/accept')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(acceptInviteSchema))
  async acceptInvite(@Body() body: AcceptInviteDTO, @Res({passthrough: true}) res: Response) {
    try {
      const jwt = await this.usersService.acceptInvite(body);
      const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);

      res.cookie('auth', jwt, {
        httpOnly: true,
        secure: appConfig.environment === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return {
        message: 'Invite accepted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to accept invite', error);
      throw error;
    }
  }
}
