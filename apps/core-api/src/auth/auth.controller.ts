import {Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {
  loginSchema,
  LoginDTO,
  SetupDTO,
  setupSchema,
  UserContract,
  forgotPasswordSchema,
  ForgotPasswordDTO,
  resetPasswordSchema,
  ResetPasswordDTO,
} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';
import {Response} from 'express';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {
  AuthSuccessResponseSwaggerDTO,
  LoginSwaggerDTO,
  SetupSwaggerDTO,
  UserResponseSwaggerDTO,
  ForgotPasswordSwaggerDTO,
  ResetPasswordSwaggerDTO,
} from 'src/tools/swagger/auth.swagger.dto';

@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Initial system setup',
    description:
      'Creates the first user and household for the system. This endpoint should only be called once during initial setup.',
  })
  @ApiBody({
    type: SetupSwaggerDTO,
    description: 'Setup data including user and household information',
    examples: {
      setup: {
        summary: 'Initial Setup',
        value: {
          user: {
            username: 'admin',
            email: 'admin@example.com',
            password: 'SecurePassword123',
            confirm_password: 'SecurePassword123',
          },
          household: {
            name: 'Admin Household',
            currencyCode: 'USD',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: AuthSuccessResponseSwaggerDTO,
    description: 'Setup completed successfully. Authentication cookie is set.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or setup already completed',
  })
  @Post('setup')
  @UsePipes(new ZodValidationPipe(setupSchema as ZodSchema))
  async setup(@Body() dto: SetupDTO, @Res({passthrough: true}) res: Response) {
    const result = await this.authService.setup(dto);
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);

    res.cookie('auth', result.accessToken, {
      httpOnly: true,
      secure: appConfig.environment === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return {
      message: 'Setup completed successfully',
    };
  }

  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns an access token via HTTP-only cookie',
  })
  @ApiBody({
    type: LoginSwaggerDTO,
    description: 'Login credentials',
    examples: {
      login: {
        summary: 'User Login',
        value: {
          email: 'john@example.com',
          password: 'MySecurePassword123',
        },
      },
    },
  })
  @ApiOkResponse({
    type: AuthSuccessResponseSwaggerDTO,
    description: 'Login successful. Authentication cookie is set.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO, @Res({passthrough: true}) res: Response) {
    const result = await this.authService.loginUser(dto);
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);

    res.cookie('auth', result.accessToken, {
      httpOnly: true,
      secure: appConfig.environment === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return {
      message: 'Logged in successfully',
    };
  }

  @ApiOperation({
    summary: 'User logout',
    description: 'Clears the authentication cookie to log the user out',
  })
  @ApiNoContentResponse({
    description: 'Logout successful. Authentication cookie cleared.',
  })
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  logout(@Res({passthrough: true}) res: Response): void {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    res.clearCookie('auth', {
      httpOnly: true,
      secure: appConfig.environment === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the current authenticated user information',
  })
  @ApiOkResponse({
    type: UserResponseSwaggerDTO,
    description: 'User information retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: JwtPayload): Promise<UserContract> {
    return (await this.authService.getUserById(user.sub)) as UserContract;
  }

  @ApiOperation({
    summary: 'Forgot password',
    description: 'Sends a password reset email if an account exists. Always returns success.',
  })
  @ApiBody({
    type: ForgotPasswordSwaggerDTO,
    description: 'Email address for password reset',
    examples: {
      forgotPassword: {
        summary: 'Forgot Password Request',
        value: {
          email: 'john@example.com',
        },
      },
    },
  })
  @ApiOkResponse({
    type: AuthSuccessResponseSwaggerDTO,
    description: 'Password reset request processed successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post('forgot-password')
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    await this.authService.forgotPassword(dto);
    return {
      message: 'If an account exists, an email has been sent',
    };
  }

  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets the user password using a time-limited token.',
  })
  @ApiBody({
    type: ResetPasswordSwaggerDTO,
    description: 'Password reset data with token',
    examples: {
      resetPassword: {
        summary: 'Reset Password Request',
        value: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          password: 'MyNewSecurePassword123',
          confirm_password: 'MyNewSecurePassword123',
        },
      },
    },
  })
  @ApiOkResponse({
    type: AuthSuccessResponseSwaggerDTO,
    description: 'Password reset successful.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired token',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    await this.authService.resetPassword(dto);
    return {
      message: 'Password reset successful',
    };
  }
}
