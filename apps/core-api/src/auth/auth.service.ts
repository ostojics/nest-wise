import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {LoginDTO, SetupDTO} from '@nest-wise/contracts';
import {verifyPassword} from 'src/lib/hashing/hashing';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {HouseholdsService} from 'src/households/households.service';
import {LicensesService} from 'src/licenses/licenses.service';
import {DataSource} from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly householdsService: HouseholdsService,
    private readonly licensesService: LicensesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
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
}
