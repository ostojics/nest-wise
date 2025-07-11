import {Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards, UsePipes} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDTO, loginSchema, SetupDTO, setupSchema} from '@maya-vault/validation';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';
import {Response} from 'express';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {AuthGuard, JwtPayload} from 'src/common/guards/auth.guard';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    return await this.authService.getUserById(user.sub);
  }
}
