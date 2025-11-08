import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {LoginDTO, SetupDTO, ForgotPasswordDTO, ResetPasswordDTO} from '@nest-wise/contracts';
import {verifyPassword} from 'src/lib/hashing/hashing';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {HouseholdsService} from 'src/households/households.service';
import {LicensesService} from 'src/licenses/licenses.service';
import {DataSource} from 'typeorm';
import {EmailsService} from 'src/emails/emails.service';
import {PosthogService} from 'src/lib/posthog/posthog.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly householdsService: HouseholdsService,
    private readonly licensesService: LicensesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly emailsService: EmailsService,
    private readonly posthogService: PosthogService,
  ) {}

  async setup(dto: SetupDTO) {
    const license = await this.licensesService.validateLicenseKey(dto.licenseKey);

    // Use transaction to ensure atomicity
    return await this.dataSource.transaction(async (_manager) => {
      const household = await this.householdsService.createHousehold({
        ...dto.household,
        licenseId: license.id,
      });

      // Create initial user as household author
      const user = await this.usersService.createUser({
        email: dto.user.email,
        username: dto.user.username,
        password: dto.user.password,
        householdId: household.id,
        isHouseholdAuthor: true,
      });

      await this.licensesService.markLicenseAsUsed(license.id);

      // Track household creation and user signup
      this.posthogService.capture({
        distinctId: user.id,
        event: 'household_created',
        properties: {
          household_id: household.id,
          household_name: household.name,
          currency: household.currencyCode,
        },
      });

      this.posthogService.capture({
        distinctId: user.id,
        event: 'user_signup',
        properties: {
          email: user.email,
          signup_method: 'email',
        },
      });

      this.posthogService.capture({
        distinctId: user.id,
        event: 'setup_completed',
        properties: {
          household_id: household.id,
        },
      });

      const token = await this.craftJwt(user.id, user.email);

      return {
        accessToken: token,
      };
    });
  }

  async getUserById(userId: string) {
    return await this.usersService.findUserById(userId);
  }

  async loginUser({email, password}: LoginDTO) {
    const user = await this.usersService.findUserByEmail(email);

    const hashToVerify = user ? user.passwordHash : 'a-dummy-hash-that-is-long-and-complex';
    const passwordIsValid = await verifyPassword(password, hashToVerify);

    if (!user || !passwordIsValid) {
      throw new UnauthorizedException('Neispravni kredencijali');
    }

    // Track user login
    this.posthogService.capture({
      distinctId: user.id,
      event: 'user_login',
      properties: {
        email: user.email,
        login_method: 'email',
      },
    });

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
        throw new UnauthorizedException('Neispravan token');
      }

      const user = await this.usersService.findUserById(payload.sub);
      if (user.email !== payload.email) {
        throw new UnauthorizedException('Neispravan token');
      }

      await this.usersService.setPassword(user.id, dto.password);

      return;
    } catch {
      throw new UnauthorizedException('Neispravan ili istekao token');
    }
  }
}
