import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import {LicensesRepository} from './licenses.repository';
import {License} from './license.entity';
import {isAfter} from 'date-fns';

@Injectable()
export class LicensesService {
  constructor(private readonly licensesRepository: LicensesRepository) {}

  async validateLicenseKey(key: string): Promise<License> {
    const license = await this.licensesRepository.findByKey(key);

    if (!license) {
      throw new NotFoundException('Licencni ključ nije pronađen');
    }

    if (license.usedAt) {
      throw new ForbiddenException('Licencni ključ je već iskorišćen');
    }

    if (this.hasLicenseExpired(license.expiresAt)) {
      throw new ForbiddenException('Licencni ključ je istekao');
    }

    return license;
  }

  async validateLicenseById(licenseId: string): Promise<void> {
    const license = await this.licensesRepository.findById(licenseId);

    if (!license) {
      throw new NotFoundException('Licenca nije pronađena');
    }

    if (!license.usedAt) {
      throw new ForbiddenException('Licenca još uvek nije iskorišćena');
    }

    if (this.hasLicenseExpired(license.expiresAt)) {
      throw new ForbiddenException('Licenca je istekla');
    }
  }

  async markLicenseAsUsed(licenseId: string): Promise<void> {
    await this.licensesRepository.markAsUsed(licenseId);
  }

  async createLicense(licenseData: {expiresAt: Date; note?: string}): Promise<License> {
    return await this.licensesRepository.create(licenseData);
  }

  private hasLicenseExpired(expiryDate: Date): boolean {
    const now = new Date();
    return isAfter(now, expiryDate);
  }
}
