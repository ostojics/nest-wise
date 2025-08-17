import {Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import {UsersRepository} from './users.repository';
import {User} from './user.entity';
import {CreateUserDTO} from '@maya-vault/validation';
import {hashPassword} from 'src/lib/hashing/hashing';
import {HouseholdsService} from 'src/households/households.service';
import {EmailsService} from 'src/emails/emails.service';
import {ConfigService} from '@nestjs/config';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly householdsService: HouseholdsService,
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userData: CreateUserDTO): Promise<User> {
    const emailExists = await this.usersRepository.emailExists(userData.email);
    if (emailExists) {
      throw new ConflictException('Cannot create user');
    }

    const usernameExists = await this.usersRepository.usernameExists(userData.username);
    if (usernameExists) {
      throw new ConflictException('Cannot create user');
    }

    const passwordHash = await hashPassword(userData.password);
    return await this.usersRepository.create({
      email: userData.email,
      username: userData.username,
      passwordHash,
      householdId: userData.householdId,
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
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
      throw new NotFoundException('User not found');
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.usersRepository.emailExists(userData.email);
      if (emailExists) {
        throw new ConflictException('Cannot update user');
      }
    }

    if (userData.username && userData.username !== existingUser.username) {
      const usernameExists = await this.usersRepository.usernameExists(userData.username);
      if (usernameExists) {
        throw new ConflictException('Cannot update user');
      }
    }

    const updatedUser = await this.usersRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }

  async inviteUser(householdId: string, email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const household = await this.householdsService.findHouseholdById(householdId);
    const {webAppUrl} = this.configService.getOrThrow<AppConfig>(AppConfigName);

    await this.emailsService.sendEmail({
      to: email,
      from: 'no-reply@resend.dev',
      subject: 'Invitation to join household',
      html: `
      <p>You have been invited to join household <b>${household.name}</b> on Maya Vault. Please click the link below to accept the invitation:</p>
      <a href="${webAppUrl}/invites">Accept Invitation</a>
      `,
    });
  }
}
