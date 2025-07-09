import {Controller} from '@nestjs/common';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('profile')
  // @UseGuards(AuthGuard)
  // async getProfile(@CurrentUser() user: JwtPayload) {
  //   const userProfile = await this.usersService.findUserById(user.sub);
  //   return {
  //     id: userProfile.id,
  //     username: userProfile.username,
  //     email: userProfile.email,
  //     createdAt: userProfile.createdAt,
  //     updatedAt: userProfile.updatedAt,
  //   };
  // }
}
