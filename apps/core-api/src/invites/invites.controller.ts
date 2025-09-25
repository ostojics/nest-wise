import {AcceptInviteDTO, acceptInviteSchema} from '@nest-wise/contracts';
import {Body, Controller, HttpCode, Post, Res, UsePipes} from '@nestjs/common';
import {ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Logger} from 'pino-nestjs';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {AcceptInviteSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';
import {UsersService} from 'src/users/users.service';
import {Response} from 'express';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {ConfigService} from '@nestjs/config';
import {AuthSuccessResponseSwaggerDTO} from 'src/tools/swagger/auth.swagger.dto';
import {setAuthCookie} from 'src/lib/cookies/setAuthCookie';

@ApiTags('Invites')
@Controller({
  version: '1',
  path: 'invites',
})
export class InvitesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Accept an invite to a household',
    description: 'Accepts an invite to a household',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  @ApiCreatedResponse({
    type: AuthSuccessResponseSwaggerDTO,
    description: 'Invite accepted successfully',
  })
  @ApiBody({
    type: AcceptInviteSwaggerDTO,
    description: 'Details required to accept an invitation',
  })
  @Post('accept')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(acceptInviteSchema))
  async acceptInvite(@Body() body: AcceptInviteDTO, @Res({passthrough: true}) res: Response) {
    try {
      const jwt = await this.usersService.acceptInvite(body);
      const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);

      setAuthCookie(res, jwt, appConfig);

      return {
        message: 'Invite accepted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to accept invite', error);
      throw error;
    }
  }
}
