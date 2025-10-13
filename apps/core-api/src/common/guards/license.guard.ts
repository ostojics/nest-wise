import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {LicensesService} from 'src/licenses/licenses.service';
import {UsersService} from 'src/users/users.service';
import {AuthenticatedRequest} from './auth.guard';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(
    private readonly licensesService: LicensesService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      // Get user from JWT payload which includes household information
      const user = await this.usersService.findUserById(request.user.sub);

      // Validate the household's license
      await this.licensesService.validateLicenseById(user.household.licenseId);
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Nevažeća licenca ili pristup domaćinstvu');
    }
  }
}
