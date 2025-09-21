import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {LicensesService} from 'src/licenses/licenses.service';
import {HouseholdsService} from 'src/households/households.service';
import {AuthenticatedRequest} from './auth.guard';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(
    private readonly licensesService: LicensesService,
    private readonly householdsService: HouseholdsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Extract household ID from route parameters
    const householdId = request.params.id || request.params.householdId;

    if (!householdId) {
      // For routes without direct household ID, try to get it from the user's household
      try {
        const user = request.user;
        if (user.householdId) {
          const household = await this.householdsService.findHouseholdById(user.householdId);
          if (household.licenseId) {
            await this.licensesService.validateLicenseById(household.licenseId);
            return true;
          }
        }
      } catch {
        throw new ForbiddenException('Invalid license or household access');
      }
    } else {
      // Validate the household's license
      try {
        const household = await this.householdsService.findHouseholdById(householdId);
        if (household.licenseId) {
          await this.licensesService.validateLicenseById(household.licenseId);
          return true;
        }
      } catch {
        throw new ForbiddenException('Invalid license or household access');
      }
    }

    throw new ForbiddenException('No valid license found for household access');
  }
}
