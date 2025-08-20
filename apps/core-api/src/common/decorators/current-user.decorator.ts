import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {AuthenticatedRequest} from '../guards/auth.guard';
import {JwtPayload} from '../interfaces/jwt.payload.interface';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user;
});
