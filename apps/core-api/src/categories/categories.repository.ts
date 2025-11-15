import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Category} from './categories.entity';
import {ICategoryRepository} from '../repositories/category.repository.interface';

@Injectable()
export class CategoriesRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  async findById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({where: {id}});
  }

  async findByIdAndHousehold(id: string, householdId: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: {id, householdId},
    });
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

  async update(id: string, categoryData: Partial<Category>): Promise<Category | null> {
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

  async countByHousehold(householdId: string): Promise<number> {
    return await this.categoryRepository.count({where: {householdId}});
  }

  async hasTransactions(categoryId: string): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: {id: categoryId},
      relations: ['transactions'],
    });
    return !!category && category.transactions.length > 0;
  }
}
