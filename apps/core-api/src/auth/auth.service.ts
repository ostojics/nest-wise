import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {UserRegistrationDTO} from '@maya-vault/validation';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser(userData: UserRegistrationDTO) {
    return await this.usersService.createUser(userData);
  }
}
