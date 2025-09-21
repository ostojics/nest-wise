import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {LoginDTO, SetupDTO, ForgotPasswordDTO, ResetPasswordDTO} from '@nest-wise/contracts';
import {verifyPassword} from 'src/lib/hashing/hashing';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {HouseholdsService} from 'src/households/households.service';
import {EmailsService} from 'src/emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly householdsService: HouseholdsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailsService: EmailsService,
  ) {}

  async setup(dto: SetupDTO) {
    const household = await this.householdsService.createHousehold(dto.household);
    const user = await this.usersService.createUser({
      email: dto.user.email,
      username: dto.user.username,
      password: dto.user.password,
      householdId: household.id,
    });

    const token = await this.craftJwt(user.id, user.email);

    return {
      accessToken: token,
    };
  }

  async getUserById(userId: string) {
    return await this.usersService.findUserById(userId);
  }

  async loginUser({email, password}: LoginDTO) {
    const user = await this.usersService.findUserByEmail(email);

    const hashToVerify = user ? user.passwordHash : 'a-dummy-hash-that-is-long-and-complex';
    const passwordIsValid = await verifyPassword(password, hashToVerify);

    if (!user || !passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.craftJwt(user.id, user.email);

    return {
      accessToken: token,
    };
  }

  async craftJwt(userId: string, userEmail: string) {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const payload = {
      sub: userId,
      email: userEmail,
      iss: appConfig.url,
    };

    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async forgotPassword(dto: ForgotPasswordDTO) {
    const user = await this.usersService.findUserByEmail(dto.email);

    if (user) {
      await this.emailsService.sendPasswordResetEmail({
        email: user.email,
        userId: user.id,
      });
    }

    // Always resolve without throwing to avoid enumeration
    return;
  }

  async resetPassword(dto: ResetPasswordDTO) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        iss: string;
        purpose: string;
        iat: number;
        exp: number;
      }>(dto.token);

      if (payload.purpose !== 'password-reset') {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.usersService.findUserById(payload.sub);
      if (!user || user.email !== payload.email) {
        throw new UnauthorizedException('Invalid token');
      }

      await this.usersService.setPassword(user.id, dto.password);

      return;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
