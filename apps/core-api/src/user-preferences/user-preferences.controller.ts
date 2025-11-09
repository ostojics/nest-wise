import {Body, Controller, Get, Put, HttpCode, HttpStatus, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {UserPreferencesService} from './user-preferences.service';
import {
  UpdateUserPreferencesDTO,
  updateUserPreferencesSchema,
  GetUserPreferencesResponseDTO,
} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';

@ApiTags('User Preferences')
@Controller({
  version: '1',
  path: 'user-preferences',
})
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @ApiOperation({
    summary: 'Get user preferences',
    description: 'Returns the current user preferences. Creates default preferences if none exist.',
  })
  @ApiOkResponse({
    description: 'User preferences retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        automaticLogout: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserPreferences(@CurrentUser() user: JwtPayload): Promise<GetUserPreferencesResponseDTO> {
    const preferences = await this.userPreferencesService.getUserPreferences(user.sub);

    return {
      automaticLogout: preferences.automaticLogout,
    };
  }

  @ApiOperation({
    summary: 'Update user preferences',
    description: 'Updates user preferences. Creates preferences if they do not exist.',
  })
  @ApiBody({
    description: 'User preferences update data',
    schema: {
      type: 'object',
      properties: {
        automaticLogout: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User preferences updated successfully',
    schema: {
      type: 'object',
      properties: {
        automaticLogout: {
          type: 'boolean',
          example: true,
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
  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(updateUserPreferencesSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async updateUserPreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserPreferencesDTO,
  ): Promise<GetUserPreferencesResponseDTO> {
    const preferences = await this.userPreferencesService.updateUserPreferences(user.sub, dto);

    return {
      automaticLogout: preferences.automaticLogout,
    };
  }
}
