import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {HouseholdsModule} from 'src/households/households.module';

@Module({
  imports: [
    UsersModule,
    HouseholdsModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.getOrThrow<AppConfig>(AppConfigName);

        return {
          secret: appConfig.jwtSecret,
          signOptions: {expiresIn: '7d'},
        };
      },
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
