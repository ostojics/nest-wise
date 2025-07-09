import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {LoginDTO, UserRegistrationDTO} from '@maya-vault/validation';
import {verifyPassword} from 'src/lib/hashing/hashing';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(userData: UserRegistrationDTO) {
    return await this.usersService.createUser(userData);
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

    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const payload = {
      sub: user.id,
      email: user.email,
      iss: appConfig.url,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
    };
  }
}
