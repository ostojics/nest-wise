import {
  Body,
  Controller,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import {UsersService} from './users.service';
import {
  updateUsernameSchema,
  UpdateUsernameDTO,
  requestEmailChangeSchema,
  RequestEmailChangeDTO,
  confirmEmailChangeSchema,
  ConfirmEmailChangeDTO,
} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {EmailsService} from 'src/emails/emails.service';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Update username',
    description: 'Updates the current user username',
  })
  @ApiBody({
    description: 'New username',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9_-]+$',
          example: 'newusername',
        },
      },
      required: ['username'],
    },
  })
  @ApiOkResponse({
    description: 'Username updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Korisničko ime je izmenjeno',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Username already exists',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @Put('username')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(updateUsernameSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async updateUsername(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUsernameDTO) {
    try {
      await this.usersService.updateUser(user.sub, {username: dto.username});
      return {
        message: 'Korisničko ime je izmenjeno',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Korisničko ime već postoji');
      }
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Request email change',
    description: 'Initiates the email change process by sending a confirmation email to the new address',
  })
  @ApiBody({
    description: 'New email address',
    schema: {
      type: 'object',
      properties: {
        newEmail: {
          type: 'string',
          format: 'email',
          example: 'newemail@example.com',
        },
      },
      required: ['newEmail'],
    },
  })
  @ApiOkResponse({
    description: 'Email change request processed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Poslali smo Vam link za potvrdu na novu e‑poštu',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @Post('email-change')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(requestEmailChangeSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async requestEmailChange(@CurrentUser() user: JwtPayload, @Body() dto: RequestEmailChangeDTO) {
    // Check if the new email is already in use
    const existingUser = await this.usersService.findUserByEmail(dto.newEmail);
    if (existingUser) {
      throw new ConflictException('E‑pošta je već u upotrebi');
    }

    // Generate JWT token for email change confirmation
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const jwtPayload = {
      sub: user.sub,
      email: user.email,
      newEmail: dto.newEmail,
      iss: appConfig.url,
      purpose: 'email-change',
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
    });

    // Send email with confirmation link
    await this.emailsService.sendEmailChangeConfirmation({
      userId: user.sub,
      newEmail: dto.newEmail,
      token,
    });

    return {
      message: 'Poslali smo Vam link za potvrdu na novu e‑poštu',
    };
  }

  @ApiOperation({
    summary: 'Confirm email change',
    description: 'Confirms the email change using a token sent to the new email address',
  })
  @ApiBody({
    description: 'Email change confirmation token',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['token'],
    },
  })
  @ApiOkResponse({
    description: 'Email changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'E‑pošta je uspešno promenjena',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired token',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post('email-change/confirm')
  @UsePipes(new ZodValidationPipe(confirmEmailChangeSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async confirmEmailChange(@Body() dto: ConfirmEmailChangeDTO) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        newEmail: string;
        iss: string;
        purpose: string;
        iat: number;
        exp: number;
      }>(dto.token);

      if (payload.purpose !== 'email-change') {
        throw new UnauthorizedException('Neispravan token');
      }

      // Verify current user email matches token
      const user = await this.usersService.findUserById(payload.sub);
      if (user.email !== payload.email) {
        throw new UnauthorizedException('Neispravan token');
      }

      // Check if the new email is still available
      const existingUser = await this.usersService.findUserByEmail(payload.newEmail);
      if (existingUser && existingUser.id !== payload.sub) {
        throw new ConflictException('E‑pošta je već u upotrebi');
      }

      // Update user email
      await this.usersService.updateUser(payload.sub, {email: payload.newEmail});

      return {
        message: 'E‑pošta je uspešno promenjena',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException('Neispravan ili istekao token');
    }
  }
}
