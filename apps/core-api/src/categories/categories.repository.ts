import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Category} from './categories.entity';
import {UpdateCategoryDTO} from '@nest-wise/contracts';

interface CreateCategoryData {
  name: string;
  description?: string;
  householdId: string;
  isDefault?: boolean;
}

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(categoryData: CreateCategoryData): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  async findById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({where: {id}});
  }

  async findByHouseholdId(householdId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {householdId},
      order: {name: 'ASC'},
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async update(id: string, categoryData: UpdateCategoryDTO): Promise<Category | null> {
    const updateResult = await this.categoryRepository.update(id, categoryData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.categoryRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.categoryRepository.count({where: {id}});
    return count > 0;
  }

  async nameExistsForHousehold(name: string, householdId: string): Promise<boolean> {
    const count = await this.categoryRepository.count({where: {name, householdId}});
    return count > 0;
  }

  async findDefaultByHouseholdId(householdId: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: {householdId, isDefault: true},
    });
  }

  async clearDefaultForHousehold(householdId: string): Promise<void> {
    await this.categoryRepository.update({householdId, isDefault: true}, {isDefault: false});
  }
}
