import {Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import {CategoriesRepository} from './categories.repository';
import {Category} from './categories.entity';
import {CreateCategoryDTO, UpdateCategoryDTO} from '@nest-wise/contracts';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async createCategoryForHousehold(householdId: string, categoryData: CreateCategoryDTO): Promise<Category> {
    const nameExists = await this.categoriesRepository.nameExistsForHousehold(categoryData.name, householdId);
    if (nameExists) {
      throw new ConflictException('Category name already exists for this household');
    }

    return await this.categoriesRepository.create({
      name: categoryData.name,
      householdId,
    });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findCategoriesByHouseholdId(householdId: string): Promise<Category[]> {
    return await this.categoriesRepository.findByHouseholdId(householdId);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoriesRepository.findAll();
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDTO): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (categoryData.name && categoryData.name !== existingCategory.name) {
      const nameExists = await this.categoriesRepository.nameExistsForHousehold(
        categoryData.name,
        existingCategory.householdId,
      );
      if (nameExists) {
        throw new ConflictException('Category name already exists for this household');
      }
    }

    const updatedCategory = await this.categoriesRepository.update(id, categoryData);
    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const deleted = await this.categoriesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Category not found');
    }
  }
}
