import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {UsersService} from './users.service';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard, JwtPayload} from 'src/common/guards/auth.guard';
import {UserContract} from '@maya-vault/contracts';
import {UserResponseSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get users in my household',
    description: "Retrieves all users that belong to the authenticated user's household",
  })
  @ApiOkResponse({
    type: [UserResponseSwaggerDTO],
    description: 'Users retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('')
  async getUsers(@CurrentUser() user: JwtPayload): Promise<UserContract[]> {
    const me = await this.usersService.findUserById(user.sub);
    return (await this.usersService.findUsersByHouseholdId(me.householdId)) as UserContract[];
  }
}
