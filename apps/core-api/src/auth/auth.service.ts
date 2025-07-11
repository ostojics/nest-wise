import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {LoginDTO, SetupDTO} from '@maya-vault/validation';
import {verifyPassword} from 'src/lib/hashing/hashing';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {HouseholdsService} from 'src/households/households.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly householdsService: HouseholdsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async loginUser(userData: LoginDTO) {
    const user = await this.usersService.findUserByEmail(userData.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await verifyPassword(userData.password, user.passwordHash);
    if (!passwordValid) {
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
