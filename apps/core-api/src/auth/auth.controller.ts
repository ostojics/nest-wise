import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserRegistrationDTO, userRegistrationSchema} from '@maya-vault/validation';
import {ZodValidationPipe} from '../lib/pipes/zod.vallidation.pipe';
import {ZodSchema} from 'zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(userRegistrationSchema as ZodSchema))
  register(@Body() dto: UserRegistrationDTO) {
    return this.authService.registerUser(dto);
  }
}
