import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {LicensesService} from 'src/licenses/licenses.service';
import {HouseholdsService} from 'src/households/households.service';
import {AuthenticatedRequest} from './auth.guard';

export const SKIP_LICENSE_CHECK = 'skipLicenseCheck';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(
    private readonly licensesService: LicensesService,
    private readonly householdsService: HouseholdsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if license check should be skipped for this route
    const skipLicenseCheck = this.reflector.getAllAndOverride<boolean>(SKIP_LICENSE_CHECK, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipLicenseCheck) {
      return true;
    }

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
