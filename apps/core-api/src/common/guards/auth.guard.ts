import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      (request as AuthenticatedRequest).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.auth as string | undefined;
  }
}
