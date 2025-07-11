import {Body, Controller, HttpCode, HttpStatus, Post, Res, UsePipes} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDTO, loginSchema, UserRegistrationDTO, userRegistrationSchema} from '@maya-vault/validation';
import {ZodValidationPipe} from '../lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';
import {Response} from 'express';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(userRegistrationSchema as ZodSchema))
  register(@Body() dto: UserRegistrationDTO) {
    return this.authService.registerUser(dto);
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
}
