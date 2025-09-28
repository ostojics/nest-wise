import {CreateUserDTO} from '@nest-wise/contracts';
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {EmailsService} from 'src/emails/emails.service';
import {HouseholdsService} from 'src/households/households.service';
import {hashPassword} from 'src/lib/hashing/hashing';
import {User} from './user.entity';
import {UsersRepository} from './users.repository';
import {AcceptInviteDTO} from '@nest-wise/contracts';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {JwtService} from '@nestjs/jwt';
import {Logger} from 'pino-nestjs';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly householdsService: HouseholdsService,
    private readonly emailsService: EmailsService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userData: CreateUserDTO & {isHouseholdAuthor?: boolean}): Promise<User> {
    const emailExists = await this.usersRepository.emailExists(userData.email);
    if (emailExists) {
      throw new ConflictException('Nije moguće kreirati korisnika');
    }

    const usernameExists = await this.usersRepository.usernameExists(userData.username);
    if (usernameExists) {
      throw new ConflictException('Nije moguće kreirati korisnika');
    }

    const passwordHash = await hashPassword(userData.password);
    return await this.usersRepository.create({
      email: userData.email,
      username: userData.username,
      passwordHash,
      householdId: userData.householdId,
      isHouseholdAuthor: userData.isHouseholdAuthor ?? false,
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Korisnik nije pronađen');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findByUsername(username);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findUsersByHouseholdId(householdId: string): Promise<User[]> {
    await this.householdsService.findHouseholdById(householdId);
    return await this.usersRepository.findByHouseholdIdWithHousehold(householdId);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Korisnik nije pronađen');
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.usersRepository.emailExists(userData.email);
      if (emailExists) {
        throw new ConflictException('Nije moguće izmeniti korisnika');
      }
    }

    if (userData.username && userData.username !== existingUser.username) {
      const usernameExists = await this.usersRepository.usernameExists(userData.username);
      if (usernameExists) {
        throw new ConflictException('Nije moguće izmeniti korisnika');
      }
    }

    const updatedUser = await this.usersRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException('Korisnik nije pronađen');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Korisnik nije pronađen');
    }
  }

  async inviteUser(householdId: string, email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new ConflictException('Korisnik sa ovom e‑poštom već postoji');
    }

    const household = await this.householdsService.findHouseholdById(householdId);

    await this.emailsService.sendInviteEmail({
      email,
      householdName: household.name,
      householdId: household.id,
    });
  }

  async acceptInvite(dto: AcceptInviteDTO) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(dto.token);
    await this.householdsService.findHouseholdById(payload.sub);

    const user = await this.createUser({
      email: dto.email,
      username: dto.username,
      password: dto.password,
      householdId: payload.sub,
    });

    const jwt = await this.craftJwt(user.id, user.email);
    this.logger.log(`User ${dto.email} accepted invite to household ${payload.sub}`);

    return jwt;
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

  async setPassword(userId: string, newPlainPassword: string): Promise<User> {
    const hashedPassword = await hashPassword(newPlainPassword);
    const updatedUser = await this.usersRepository.update(userId, {passwordHash: hashedPassword});

    if (!updatedUser) {
      throw new NotFoundException('Korisnik nije pronađen');
    }

    return updatedUser;
  }
}
