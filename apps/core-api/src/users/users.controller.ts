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
@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    await this.usersService.requestEmailChange(user.sub, user.email, dto.newEmail);

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
      await this.usersService.confirmEmailChange(dto.token);
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
