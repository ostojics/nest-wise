import {Body, Controller, HttpCode, HttpStatus, Post, UsePipes} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDTO, loginSchema, UserRegistrationDTO, userRegistrationSchema} from '@maya-vault/validation';
import {ZodValidationPipe} from '../lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(userRegistrationSchema as ZodSchema))
  register(@Body() dto: UserRegistrationDTO) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema as ZodSchema))
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDTO) {
    return 'hello';
  }
}
