import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {License} from './license.entity';

@Injectable()
export class LicensesRepository {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
  ) {}

  async findByKey(key: string): Promise<License | null> {
    return await this.licenseRepository.findOne({where: {key}});
  }

  async findById(id: string): Promise<License | null> {
    return await this.licenseRepository.findOne({where: {id}});
  }

  async markAsUsed(id: string): Promise<void> {
    await this.licenseRepository.update(id, {
      usedAt: new Date(),
    });
  }

  async create(licenseData: Partial<License>): Promise<License> {
    const license = this.licenseRepository.create(licenseData);
    return await this.licenseRepository.save(license);
  }
}
